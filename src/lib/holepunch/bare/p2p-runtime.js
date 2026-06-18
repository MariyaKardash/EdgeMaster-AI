const Corestore = require('corestore');
const Hyperbee = require('hyperbee');
const Hypercore = require('hypercore');
const Hyperswarm = require('hyperswarm');
const b4a = require('b4a');
const c = require('compact-encoding');

const { IPC } = BareKit;

const LOCAL_STORE_NAME = 'local-index';
const SESSION_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CONTROL_PROTOCOL = 'dd-ai-control';

let store = null;
let localBee = null;
let campaignCore = null;
let campaignBee = null;
let activeCampaignId = null;
let swarm = null;
let discovery = null;
let campaignDiscovery = null;
let currentRole = null;
let currentAlias = 'device';
let currentTopicHex = null;
let inputBuffer = '';
const peers = new Map();
const remotePutWaiters = new Map();

IPC.on('data', (chunk) => {
  inputBuffer += b4a.toString(chunk);

  while (true) {
    const boundary = inputBuffer.indexOf('\n');
    if (boundary === -1) break;

    const line = inputBuffer.slice(0, boundary).trim();
    inputBuffer = inputBuffer.slice(boundary + 1);

    if (!line) continue;

    let message = null;

    try {
      message = JSON.parse(line);
    } catch (error) {
      log('[IPC]', 'invalid command line', { line }, error.message);
      send({
        type: 'error',
        message: `Invalid command: ${error.message}`,
      });
      continue;
    }

    log('[IPC]', 'received command', message);

    handleCommand(message).catch((error) => {
      log(
        '[IPC]',
        'command failed',
        { type: message.type, requestId: message.requestId },
        error.message,
      );
      send({
        type: 'error',
        message: error && error.message ? error.message : String(error),
        requestId: message.requestId,
      });
    });
  }
});

async function handleCommand(message) {
  log('[handleCommand]', message);

  switch (message.type) {
    case 'init':
      await initStorage(message);
      break;
    case 'open-campaign':
      await openCampaign(message);
      break;
    case 'close-campaign':
      await closeCampaign(message);
      break;
    case 'put':
      await putRecord(message);
      break;
    case 'get':
      await getRecord(message);
      break;
    case 'del':
      await delRecord(message);
      break;
    case 'list':
      await listRecords(message);
      break;
    case 'start-swarm':
      await startSwarm(message);
      break;
    case 'stop-swarm':
      log('[handleCommand]', 'stopping swarm');
      await stopSwarm();
      send({ type: 'stopped' });
      break;
    case 'start':
      await startSwarm(message);
      break;
    case 'chat':
      broadcastChat(message);
      break;
    case 'stop':
      log('[handleCommand]', 'stopping swarm (legacy stop command)');
      await stopSwarm();
      send({ type: 'stopped' });
      break;
    default:
      log('[handleCommand]', 'unknown command type', message.type);
      send({
        type: 'error',
        message: `Unknown command type: ${message.type}`,
        requestId: message.requestId,
      });
  }
}

function normalizeStoragePath(storagePath) {
  return String(storagePath || '')
    .trim()
    .replace(/^file:\/\//, '');
}

function sessionIdSegment(hex, offset, length) {
  return Array.from({ length }, (_, index) => {
    const byte = Number.parseInt(hex.slice((offset + index) * 2, (offset + index) * 2 + 2), 16);
    return SESSION_CODE_ALPHABET[byte % SESSION_CODE_ALPHABET.length];
  }).join('');
}

function sessionIdFromCampaignId(campaignId) {
  const hex = String(campaignId).replace(/-/g, '').toLowerCase();

  if (!/^[0-9a-f]{32}$/.test(hex)) {
    throw new Error('Campaign id must be a UUID.');
  }

  return `${sessionIdSegment(hex, 0, 4)}-${sessionIdSegment(hex, 4, 4)}`;
}

function topicHexFromRoom(room) {
  const normalized = String(room).trim().toUpperCase() || 'holepunch-playground';
  const bytes = new Uint8Array(32);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = normalized.charCodeAt(index % normalized.length) & 0xff;
  }

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function campaignTopicHex(campaignId) {
  return topicHexFromRoom(sessionIdFromCampaignId(campaignId));
}

function resolveTopicHex(message, role) {
  log('[resolveTopicHex]', { role, activeCampaignId });

  if (role === 'host') {
    if (!activeCampaignId) {
      throw new Error('Open a campaign before hosting a session.');
    }

    const sessionCode = message.sessionCode ? String(message.sessionCode).trim().toUpperCase() : '';

    if (sessionCode) {
      const resolved = topicHexFromRoom(sessionCode);
      log('[resolveTopicHex]', 'host topic from session code', { sessionCode }, resolved);
      return resolved;
    }

    const topicHex = campaignTopicHex(activeCampaignId);
    log('[resolveTopicHex]', 'host topic from active campaign', { activeCampaignId }, topicHex);
    return topicHex;
  }

  const topicHex = message.topicHex ? String(message.topicHex).trim().toLowerCase() : '';
  const sessionCode = message.sessionCode ? String(message.sessionCode).trim().toUpperCase() : '';
  const campaignId = message.campaignId ? String(message.campaignId).trim() : '';

  log('[resolveTopicHex]', 'join inputs', { topicHex, sessionCode, campaignId });

  if (/^[0-9a-f]{64}$/.test(topicHex)) {
    log('[resolveTopicHex]', 'using explicit topic hex', topicHex);
    return topicHex;
  }

  if (sessionCode) {
    const resolved = topicHexFromRoom(sessionCode);
    log('[resolveTopicHex]', 'using session code', { sessionCode }, resolved);
    return resolved;
  }

  if (campaignId) {
    const resolved = campaignTopicHex(campaignId);
    log('[resolveTopicHex]', 'using campaign id', { campaignId }, resolved);
    return resolved;
  }

  throw new Error('Topic hex, session code, or campaign id is required to join.');
}

async function initStorage(message) {
  log('[initStorage]', 'starting', message);

  const storagePath = normalizeStoragePath(message.storagePath);

  if (!storagePath) {
    throw new Error('Storage path is required.');
  }

  log('[initStorage]', 'normalized storage path', storagePath);

  await closeCampaign();
  await destroySwarmFully();

  if (store) {
    log('[initStorage]', 'closing existing store');
    await store.close();
  }

  log('[initStorage]', 'creating corestore');
  store = new Corestore(storagePath);
  await store.ready();

  log('[initStorage]', 'opening local core', { name: LOCAL_STORE_NAME });
  const localCore = store.get({ name: LOCAL_STORE_NAME });
  await localCore.ready();

  log('[initStorage]', 'creating local hyperbee');
  localBee = new Hyperbee(localCore, {
    keyEncoding: 'utf-8',
    valueEncoding: 'json',
  });
  await localBee.ready();

  log('[initStorage]', 'storage ready');
  send({ type: 'status', message: 'Storage ready.' });
}

async function openCampaign(message, options = {}) {
  log('[openCampaign]', 'starting', { message, options });

  ensureStore();

  const campaignId = String(message.campaignId || '').trim();
  const coreKeyHex = message.coreKey ? String(message.coreKey).trim() : '';
  const silent = options.silent === true;

  if (!campaignId) {
    throw new Error('Campaign id is required.');
  }

  log('[openCampaign]', { campaignId, coreKeyHex, silent, activeCampaignId });

  if (activeCampaignId === campaignId && campaignBee && campaignCore && !coreKeyHex) {
    log('[openCampaign]', 'campaign already open, reusing');

    if (swarm) {
      attachReplicationToPeers();
    }

    if (!silent) {
      send({
        type: 'campaign-opened',
        campaignId,
        coreKey: b4a.toString(campaignCore.key, 'hex'),
        discoveryKey: b4a.toString(campaignCore.discoveryKey, 'hex'),
        writable: campaignCore.writable,
      });
    }

    return;
  }

  if (activeCampaignId !== campaignId) {
    log('[openCampaign]', 'closing previous campaign', { activeCampaignId });
    await closeCampaign({ silent: true });
  }

  if (coreKeyHex) {
    log('[openCampaign]', 'opening campaign by core key');
    campaignCore = store.get({ key: b4a.from(coreKeyHex, 'hex') });
  } else {
    log('[openCampaign]', 'opening campaign by name', { name: `campaign-${campaignId}` });
    campaignCore = store.get({ name: `campaign-${campaignId}` });
  }

  await campaignCore.ready();
  log('[openCampaign]', 'campaign core ready', {
    writable: campaignCore.writable,
    discoveryKey: b4a.toString(campaignCore.discoveryKey, 'hex'),
  });

  if (campaignBee) {
    log('[openCampaign]', 'closing previous campaign bee');
    await campaignBee.close();
  }

  log('[openCampaign]', 'creating campaign hyperbee');
  campaignBee = new Hyperbee(campaignCore, {
    keyEncoding: 'utf-8',
    valueEncoding: 'json',
  });
  await campaignBee.ready();

  activeCampaignId = campaignId;

  if (swarm) {
    log('[openCampaign]', 'attaching replication and joining campaign discovery', {
      currentRole,
      peerCount: peers.size,
    });
    attachReplicationToPeers();
    if (campaignDiscovery) {
      await campaignDiscovery.destroy();
    }
    campaignDiscovery = swarm.join(campaignCore.discoveryKey, {
      server: currentRole === 'host',
      client: true,
    });
  }

  if (!silent) {
    log('[openCampaign]', 'emitting campaign-opened');
    send({
      type: 'campaign-opened',
      campaignId,
      coreKey: b4a.toString(campaignCore.key, 'hex'),
      discoveryKey: b4a.toString(campaignCore.discoveryKey, 'hex'),
      writable: campaignCore.writable,
    });
  }

  log('[openCampaign]', 'done', { campaignId, activeCampaignId });
}

async function closeCampaign(message = {}) {
  log('[closeCampaign]', 'starting', { activeCampaignId, message });

  if (campaignDiscovery) {
    log('[closeCampaign]', 'destroying campaign discovery');
    await campaignDiscovery.destroy();
    campaignDiscovery = null;
  }

  if (campaignBee) {
    log('[closeCampaign]', 'closing campaign bee');
    await campaignBee.close();
  }

  campaignBee = null;
  campaignCore = null;
  activeCampaignId = null;

  if (message.requestId) {
    log('[closeCampaign]', 'emitting campaign-closed', { requestId: message.requestId });
    send({
      type: 'campaign-closed',
      requestId: message.requestId,
    });
  }

  log('[closeCampaign]', 'done');
}

function activeBeeForKey(key) {
  if (key.startsWith('@meta/')) {
    ensureStore();

    if (!localBee) {
      throw new Error('Local index is not ready.');
    }

    return localBee;
  }

  if (!campaignBee) {
    throw new Error('Open a campaign before reading or writing campaign data.');
  }

  return campaignBee;
}

function getOrCreateMux(socket) {
  Hypercore.createProtocolStream(socket);
  return socket.userData;
}

function sendControl(peer, packet) {
  if (!peer || typeof peer.sendControl !== 'function') {
    log('[sendControl]', 'control channel not ready', { peerId: peer?.id });
    return;
  }

  peer.sendControl(JSON.stringify(packet));
}

function attachReplicationToPeer(peer) {
  if (!campaignCore || !peer?.socket) {
    return;
  }

  const mux = getOrCreateMux(peer.socket);
  campaignCore.replicate(mux);
}

function attachReplicationToPeers() {
  if (!campaignCore) {
    log('[attachReplicationToPeers]', 'skipped, no campaign core');
    return;
  }

  log('[attachReplicationToPeers]', 'replicating to peers', { peerCount: peers.size });

  for (const peer of peers.values()) {
    attachReplicationToPeer(peer);
  }
}

function buildSessionInfoPacket() {
  if (!campaignCore || !activeCampaignId) {
    return null;
  }

  return {
    type: 'session-info',
    campaignId: activeCampaignId,
    coreKey: b4a.toString(campaignCore.key, 'hex'),
  };
}

function sendSessionInfo(peer) {
  const packet = buildSessionInfoPacket();

  if (!packet) {
    log('[sendSessionInfo]', 'skipped, no session info packet');
    return;
  }

  log('[sendSessionInfo]', 'writing session info', { activeCampaignId });
  sendControl(peer, packet);
}

function handlePeerControlLine(peer, line) {
  const peerId = peer.id;

  if (!line) {
    return;
  }

  try {
    const packet = JSON.parse(line);

    log('[startSwarm]', 'peer packet', { peerId, type: packet.type });

    if (packet.type === 'request-session-info' && currentRole === 'host') {
      sendSessionInfo(peer);
      return;
    }

    if (packet.type === 'session-info' && currentRole !== 'host') {
      log('[startSwarm]', 'received session info', { peerId, campaignId: packet.campaignId });
      handleSessionInfo(packet).catch((error) => {
        log('[startSwarm]', 'session info handling failed', { peerId }, error.message);
        send({
          type: 'error',
          message: error.message,
        });
      });
      return;
    }

    if (packet.type === 'remote-put' && currentRole === 'host') {
      log('[startSwarm]', 'remote put request', {
        peerId,
        requestId: packet.requestId,
        key: packet.key,
      });
      handleRemotePut(packet, peer).catch((error) => {
        log(
          '[startSwarm]',
          'remote put failed',
          { peerId, requestId: packet.requestId },
          error.message,
        );
        sendControl(peer, {
          type: 'remote-put-result',
          requestId: packet.requestId,
          ok: false,
          message: error.message,
        });
      });
      return;
    }

    if (packet.type === 'remote-put-result' && currentRole === 'join') {
      log('[startSwarm]', 'remote put result', {
        peerId,
        requestId: packet.requestId,
        ok: packet.ok,
      });
      handleRemotePutResult(packet);
      return;
    }

    if (packet.type === 'chat') {
      log('[startSwarm]', 'inbound chat', { peerId, author: packet.author });
      send({
        type: 'chat',
        peerId,
        author: packet.author || peerId,
        text: packet.text || '',
        inbound: true,
      });
    }
  } catch (error) {
    log('[startSwarm]', 'malformed peer packet', { peerId }, error.message);
  }
}

function setupPeerControl(peer) {
  const mux = getOrCreateMux(peer.socket);
  peer.mux = mux;

  const channel = mux.createChannel({
    protocol: CONTROL_PROTOCOL,
    onopen() {
      log('[setupPeerControl]', 'control channel open', { peerId: peer.id });

      if (currentRole === 'host') {
        sendSessionInfo(peer);
      }

      if (currentRole === 'join') {
        sendControl(peer, { type: 'request-session-info' });
      }
    },
  });

  if (!channel) {
    log('[setupPeerControl]', 'failed to create control channel', { peerId: peer.id });
    return;
  }

  const controlMessage = channel.addMessage({
    encoding: c.string,
    onmessage(line) {
      handlePeerControlLine(peer, line);
    },
  });

  peer.sendControl = (payload) => controlMessage.send(payload);
  peer.controlChannel = channel;
  channel.open();
}

function emitCampaignOpened() {
  if (!campaignCore || !activeCampaignId) {
    log('[emitCampaignOpened]', 'skipped, campaign not ready');
    return;
  }

  log('[emitCampaignOpened]', { activeCampaignId, writable: campaignCore.writable });

  send({
    type: 'campaign-opened',
    campaignId: activeCampaignId,
    coreKey: b4a.toString(campaignCore.key, 'hex'),
    discoveryKey: b4a.toString(campaignCore.discoveryKey, 'hex'),
    writable: campaignCore.writable,
  });
}

function scheduleCampaignSync() {
  if (!campaignCore) {
    log('[scheduleCampaignSync]', 'skipped, no campaign core');
    return;
  }

  log('[scheduleCampaignSync]', 'updating campaign core');

  void campaignCore.update().catch((error) => {
    log('[scheduleCampaignSync]', 'update failed', error.message);
    send({
      type: 'status',
      message: `Campaign sync warning: ${error.message}`,
    });
  });
}

async function putRecord(message, options = {}) {
  const key = String(message.key || '');
  const requestId = message.requestId;
  const fromRemote = options.fromRemote === true;

  log('[putRecord]', { key, requestId, fromRemote, currentRole });

  if (!fromRemote && campaignCore && !campaignCore.writable && currentRole === 'join') {
    log('[putRecord]', 'delegating write to host');
    await requestHostPut(message);
    return;
  }

  const bee = activeBeeForKey(key);

  log('[putRecord]', 'writing to bee', { key });
  await bee.put(key, message.value);

  send({
    type: 'db-put',
    key,
    value: message.value,
  });

  if (requestId) {
    send({
      type: 'db-put-result',
      requestId,
      key,
      ok: true,
    });
  }
}

async function requestHostPut(message) {
  const requestId = message.requestId;

  log('[requestHostPut]', { requestId, key: message.key, peerCount: peers.size });

  if (!requestId) {
    throw new Error('Remote writes require a request id.');
  }

  if (peers.size === 0) {
    throw new Error('No host connected to accept this write.');
  }

  const packet = {
    type: 'remote-put',
    requestId,
    key: message.key,
    value: message.value,
  };

  const ackPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      remotePutWaiters.delete(requestId);
      reject(new Error('Timed out waiting for host to accept the write.'));
    }, 30_000);

    remotePutWaiters.set(requestId, {
      resolve: () => {
        clearTimeout(timeout);
        resolve(undefined);
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });
  });

  log('[requestHostPut]', 'broadcasting remote-put to peers');
  for (const peer of peers.values()) {
    sendControl(peer, packet);
  }

  log('[requestHostPut]', 'waiting for host ack', { requestId });
  await ackPromise;

  log('[requestHostPut]', 'host accepted write', { requestId, key: message.key });
  send({
    type: 'db-put-result',
    requestId,
    key: message.key,
    ok: true,
  });
}

async function getRecord(message) {
  const key = String(message.key || '');

  log('[getRecord]', { key, requestId: message.requestId });

  const bee = activeBeeForKey(key);
  const entry = await bee.get(key);

  log('[getRecord]', 'read complete', { key, found: Boolean(entry) });

  send({
    type: 'db-get-result',
    requestId: message.requestId,
    key,
    value: entry ? entry.value : null,
  });
}

async function delRecord(message) {
  const key = String(message.key || '');

  log('[delRecord]', { key, requestId: message.requestId });

  const bee = activeBeeForKey(key);

  await bee.del(key);

  log('[delRecord]', 'delete complete', { key });

  send({
    type: 'db-del',
    key,
  });
  send({
    type: 'db-del-result',
    requestId: message.requestId,
    key,
    ok: true,
  });
}

async function listRecords(message) {
  const gte = String(message.gte || '');
  const lt = String(message.lt || '');

  log('[listRecords]', { gte, lt, requestId: message.requestId });

  const bee = activeBeeForKey(gte);
  const entries = [];

  for await (const entry of bee.createReadStream({ gte, lt })) {
    entries.push({
      key: entry.key,
      value: entry.value,
    });
  }

  log('[listRecords]', 'scan complete', { count: entries.length });

  send({
    type: 'db-list-result',
    requestId: message.requestId,
    entries,
  });
}

async function ensureSwarm() {
  if (!swarm || swarm.destroyed) {
    log('[ensureSwarm]', 'creating hyperswarm');
    swarm = new Hyperswarm();
    attachSwarmEvents(swarm);
  }

  log('[ensureSwarm]', 'waiting for dht ready');
  await swarm.dht.ready();
}

function attachSwarmEvents(activeSwarm) {
  if (activeSwarm.__ddAiEventsAttached) {
    return;
  }

  activeSwarm.__ddAiEventsAttached = true;

  activeSwarm.on('connection', (socket, info) => {
    log('[startSwarm]', 'peer connection', {
      currentRole,
      hasCampaignCore: Boolean(campaignCore),
    });

    const publicKey = socket.remotePublicKey || info.publicKey;
    const peerId = b4a.toString(publicKey, 'hex').slice(0, 12);
    const state = { id: peerId, socket };

    peers.set(peerId, state);

    setupPeerControl(state);

    if (campaignCore) {
      attachReplicationToPeer(state);
    }

    log('[startSwarm]', 'peer opened', { peerId, connectionCount: peers.size });

    send({
      type: 'peer-open',
      peerId,
      connectionCount: peers.size,
    });

    socket.on('error', (error) => {
      log('[startSwarm]', 'peer error', { peerId }, error.message);
      send({
        type: 'status',
        message: `Peer ${peerId} error: ${error.message}`,
      });
    });

    socket.on('close', () => {
      peers.delete(peerId);
      log('[startSwarm]', 'peer closed', { peerId, connectionCount: peers.size });
      send({
        type: 'peer-closed',
        peerId,
        connectionCount: peers.size,
      });
    });
  });

  activeSwarm.on('update', () => {
    log('[startSwarm]', 'swarm update', { peers: peers.size, connecting: activeSwarm.connecting });
    send({
      type: 'metrics',
      peers: peers.size,
      connecting: activeSwarm.connecting,
    });
  });
}

async function startSwarm(message) {
  log('[startSwarm]', 'stopping existing swarm...');

  await stopSwarm();

  const alias = String(message.alias || 'device').trim() || 'device';
  const role = message.role === 'join' ? 'join' : 'host';

  log('[startSwarm]', { alias, role });

  if (role === 'host' && !campaignCore) {
    throw new Error('Open a campaign before hosting a session.');
  }

  const topicHex = resolveTopicHex(message, role);

  log('[startSwarm]', 'resolved topic hex', { message, role }, topicHex);

  currentAlias = alias;
  currentRole = role;
  currentTopicHex = topicHex;

  log('[startSwarm]', 'resolved topic hex', { currentAlias, currentRole, currentTopicHex });

  log('[startSwarm]', 'initiating hyperswarm');
  await ensureSwarm();

  const topic = b4a.from(currentTopicHex, 'hex');
  const isHost = currentRole === 'host';

  log('[startSwarm]', 'joining topic', {
    isHost,
    currentTopicHex,
    hasCampaignCore: Boolean(campaignCore),
  });

  send({
    type: 'status',
    message: isHost ? 'Announcing room on the DHT...' : 'Looking up room on the DHT...',
  });

  discovery = swarm.join(topic, {
    server: isHost,
    client: !isHost,
  });

  if (campaignCore) {
    log('[startSwarm]', 'joining campaign discovery');
    campaignDiscovery = swarm.join(campaignCore.discoveryKey, {
      server: isHost,
      client: true,
    });
  }

  log('[startSwarm]', 'waiting for session discovery flush', { isHost });
  await discovery.flushed();

  if (isHost && campaignDiscovery) {
    log('[startSwarm]', 'waiting for campaign discovery flush');
    await campaignDiscovery.flushed();
  }

  log('[startSwarm]', 'ready', { currentRole, currentAlias, currentTopicHex });

  send({
    type: 'ready',
    role: currentRole,
    alias: currentAlias,
    topicHex: currentTopicHex,
  });
}

async function handleRemotePut(packet, peer) {
  log('[handleRemotePut]', { requestId: packet.requestId, key: packet.key });

  if (!campaignCore || !campaignCore.writable) {
    throw new Error('Host campaign is not writable.');
  }

  await putRecord(
    {
      requestId: packet.requestId,
      key: packet.key,
      value: packet.value,
    },
    { fromRemote: true },
  );

  log('[handleRemotePut]', 'acknowledging remote put', { requestId: packet.requestId });

  sendControl(peer, {
    type: 'remote-put-result',
    requestId: packet.requestId,
    ok: true,
  });
}

function handleRemotePutResult(packet) {
  log('[handleRemotePutResult]', { requestId: packet.requestId, ok: packet.ok });

  const waiter = remotePutWaiters.get(packet.requestId);

  if (!waiter) {
    log('[handleRemotePutResult]', 'no waiter for request', { requestId: packet.requestId });
    return;
  }

  remotePutWaiters.delete(packet.requestId);

  if (packet.ok) {
    log('[handleRemotePutResult]', 'resolved', { requestId: packet.requestId });
    waiter.resolve();
    return;
  }

  log('[handleRemotePutResult]', 'rejected', {
    requestId: packet.requestId,
    message: packet.message,
  });
  waiter.reject(new Error(packet.message || 'Host rejected the write.'));
}

async function handleSessionInfo(packet) {
  const campaignId = String(packet.campaignId || '').trim();
  const coreKey = String(packet.coreKey || '').trim();

  log('[handleSessionInfo]', { campaignId, coreKey, activeCampaignId });

  if (!campaignId || !coreKey) {
    throw new Error('Invalid session info from host.');
  }

  if (activeCampaignId === campaignId && campaignCore) {
    log('[handleSessionInfo]', 'campaign already active, syncing');
    emitCampaignOpened();
    scheduleCampaignSync();
    return;
  }

  log('[handleSessionInfo]', 'opening campaign from session info');
  await openCampaign({ campaignId, coreKey }, { silent: true });
  emitCampaignOpened();
  scheduleCampaignSync();
  log('[handleSessionInfo]', 'done', { campaignId });
}

function broadcastChat(message) {
  log('[broadcastChat]', message);

  if (!swarm) {
    throw new Error('Start the swarm before sending messages.');
  }

  const text = String(message.text || '').trim();

  if (!text) {
    log('[broadcastChat]', 'skipped, empty text');
    return;
  }

  if (peers.size === 0) {
    log('[broadcastChat]', 'no peers connected');
    send({
      type: 'status',
      message: 'No peer connected yet.',
    });
    return;
  }

  log('[broadcastChat]', 'sending to peers', { peerCount: peers.size, author: currentAlias, text });

  const packet = {
    type: 'chat',
    author: currentAlias,
    text,
  };

  for (const peer of peers.values()) {
    sendControl(peer, packet);
  }

  send({
    type: 'chat',
    peerId: 'local',
    author: currentAlias,
    text,
    inbound: false,
  });
}

async function stopSwarm() {
  log('[stopSwarm]', 'starting', {
    peerCount: peers.size,
    hasSwarm: Boolean(swarm),
    hasCampaignDiscovery: Boolean(campaignDiscovery),
    currentRole,
    currentTopicHex,
  });

  const closing = [];

  for (const peer of peers.values()) {
    if (peer.controlChannel) {
      peer.controlChannel.close();
    }

    log('[stopSwarm]', 'destroying peer socket', { peerId: peer.id });
    closing.push(
      new Promise((resolve) => {
        peer.socket.once('close', resolve);
        peer.socket.destroy();
      }),
    );
  }

  peers.clear();
  remotePutWaiters.clear();

  if (closing.length > 0) {
    log('[stopSwarm]', 'waiting for peer sockets to close', { count: closing.length });
    await Promise.allSettled(closing);
  }

  if (campaignDiscovery) {
    log('[stopSwarm]', 'destroying campaign discovery');
    await campaignDiscovery.destroy();
    campaignDiscovery = null;
  }

  if (discovery) {
    log('[stopSwarm]', 'destroying session discovery');
    await discovery.destroy();
    discovery = null;
  }

  currentRole = null;
  currentTopicHex = null;

  log('[stopSwarm]', 'done');
}

async function destroySwarmFully() {
  await stopSwarm();

  if (swarm) {
    log('[destroySwarmFully]', 'destroying hyperswarm');
    await swarm.destroy({ force: true });
    swarm = null;
  }

  log('[destroySwarmFully]', 'done');
}

function ensureStore() {
  if (!store) {
    throw new Error('Storage has not been initialized.');
  }
}

function send(message) {
  log('[send]', message);
  IPC.write(b4a.from(JSON.stringify(message) + '\n'));
}

function toLogValue(value) {
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }

  try {
    JSON.stringify(value);
    return value;
  } catch {
    return String(value);
  }
}

function emitLog(level, label, data) {
  try {
    IPC.write(
      b4a.from(
        JSON.stringify({
          type: 'log',
          level,
          label,
          data,
          ts: Date.now(),
        }) + '\n',
      ),
    );
  } catch {
    // Drop logs that cannot be serialized.
  }
}

function log(label, ...args) {
  console.log(`[holepunch:worklet] ${label}`, ...args);

  const data =
    args.length === 0 ? undefined : args.length === 1 ? toLogValue(args[0]) : args.map(toLogValue);

  emitLog('info', label, data);
}

const bootStoragePath = normalizeStoragePath(
  typeof Bare !== 'undefined' && Array.isArray(Bare.argv) ? Bare.argv[0] : '',
);

log('[boot]', 'runtime starting', { bootStoragePath: bootStoragePath || null });

send({ type: 'runtime-ready', storagePath: bootStoragePath || null });

if (bootStoragePath) {
  log('[boot]', 'auto-init storage', { bootStoragePath });
  handleCommand({ type: 'init', storagePath: bootStoragePath }).catch((error) => {
    log('[boot]', 'auto-init failed', error.message);
    send({
      type: 'error',
      message: error && error.message ? error.message : String(error),
    });
  });
}
