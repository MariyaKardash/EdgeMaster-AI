const Corestore = require('corestore');
const Hyperbee = require('hyperbee');
const Hyperswarm = require('hyperswarm');
const b4a = require('b4a');

const { IPC } = BareKit;

const LOCAL_STORE_NAME = 'local-index';

let store = null;
let localBee = null;
let campaignCore = null;
let campaignBee = null;
let activeCampaignId = null;
let activeSessionCode = null;
let activeSessionId = null;
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
      send({
        type: 'error',
        message: `Invalid command: ${error.message}`,
      });
      continue;
    }

    handleCommand(message).catch((error) => {
      send({
        type: 'error',
        message: error && error.message ? error.message : String(error),
        requestId: message.requestId,
      });
    });
  }
});

async function handleCommand(message) {
  log('command', message);

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
      await stopSwarm();
      send({ type: 'stopped' });
      break;
    default:
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

async function initStorage(message) {
  const storagePath = normalizeStoragePath(message.storagePath);

  if (!storagePath) {
    throw new Error('Storage path is required.');
  }

  await closeCampaign();
  await stopSwarm();

  if (store) {
    await store.close();
  }

  // initialize corestore on disk
  store = new Corestore(storagePath);
  await store.ready();
  // run specific storage by name from this folder
  const localCore = store.get({ name: LOCAL_STORE_NAME });
  await localCore.ready();
  // turn storage into table of contents like db
  localBee = new Hyperbee(localCore, {
    keyEncoding: 'utf-8',
    valueEncoding: 'json',
  });
  await localBee.ready();

  send({ type: 'status', message: 'Storage ready.' });
}

async function openCampaign(message, options = {}) {
  ensureStore();

  const campaignId = String(message.campaignId || '').trim();
  const coreKeyHex = message.coreKey ? String(message.coreKey).trim() : '';
  const silent = options.silent === true;

  if (!campaignId) {
    throw new Error('Campaign id is required.');
  }

  if (activeCampaignId !== campaignId) {
    await closeCampaign({ silent: true });
  }

  if (coreKeyHex) {
    campaignCore = store.get({ key: b4a.from(coreKeyHex, 'hex') });
  } else {
    // copied to other devices when they connect
    campaignCore = store.get({ name: `campaign-${campaignId}` });
  }

  await campaignCore.ready();

  if (campaignBee) {
    await campaignBee.close();
  }

  campaignBee = new Hyperbee(campaignCore, {
    keyEncoding: 'utf-8',
    valueEncoding: 'json',
  });
  await campaignBee.ready();

  activeCampaignId = campaignId;

  if (swarm) {
    attachReplicationToPeers();
    if (campaignDiscovery) {
      await campaignDiscovery.close();
    }
    campaignDiscovery = swarm.join(campaignCore.discoveryKey, {
      server: currentRole === 'host',
      client: true,
    });
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
}

async function closeCampaign(message = {}) {
  if (campaignDiscovery) {
    await campaignDiscovery.close();
    campaignDiscovery = null;
  }

  if (campaignBee) {
    await campaignBee.close();
  }

  campaignBee = null;
  campaignCore = null;
  activeCampaignId = null;

  if (message.requestId) {
    send({
      type: 'campaign-closed',
      requestId: message.requestId,
    });
  }
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

function attachReplicationToPeers() {
  if (!campaignCore) {
    return;
  }

  for (const peer of peers.values()) {
    campaignCore.replicate(peer.socket);
  }
}

async function putRecord(message, options = {}) {
  const key = String(message.key || '');
  const requestId = message.requestId;
  const fromRemote = options.fromRemote === true;

  if (!fromRemote && campaignCore && !campaignCore.writable && currentRole === 'join') {
    await requestHostPut(message);
    return;
  }

  const bee = activeBeeForKey(key);

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

  if (!requestId) {
    throw new Error('Remote writes require a request id.');
  }

  if (peers.size === 0) {
    throw new Error('No host connected to accept this write.');
  }

  const packet =
    JSON.stringify({
      type: 'remote-put',
      requestId,
      key: message.key,
      value: message.value,
    }) + '\n';

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

  for (const peer of peers.values()) {
    peer.socket.write(b4a.from(packet));
  }

  await ackPromise;

  send({
    type: 'db-put-result',
    requestId,
    key: message.key,
    ok: true,
  });
}

async function getRecord(message) {
  const key = String(message.key || '');
  const bee = activeBeeForKey(key);
  const entry = await bee.get(key);

  send({
    type: 'db-get-result',
    requestId: message.requestId,
    key,
    value: entry ? entry.value : null,
  });
}

async function delRecord(message) {
  const key = String(message.key || '');
  const bee = activeBeeForKey(key);

  await bee.del(key);

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
  const bee = activeBeeForKey(gte);
  const entries = [];

  for await (const entry of bee.createReadStream({ gte, lt })) {
    entries.push({
      key: entry.key,
      value: entry.value,
    });
  }

  send({
    type: 'db-list-result',
    requestId: message.requestId,
    entries,
  });
}

async function startSwarm(message) {
  await stopSwarm();

  const topicHex = String(message.topicHex || '')
    .trim()
    .toLowerCase();
  const alias = String(message.alias || 'device').trim() || 'device';
  const role = message.role === 'join' ? 'join' : 'host';
  const sessionCode = message.sessionCode ? String(message.sessionCode).trim().toUpperCase() : null;
  const sessionId = message.sessionId ? String(message.sessionId).trim() : null;

  if (!/^[0-9a-f]{64}$/i.test(topicHex)) {
    throw new Error('Topic must be a 64 character hex string.');
  }

  if (role === 'host' && !campaignCore) {
    throw new Error('Open a campaign before hosting a session.');
  }

  currentAlias = alias;
  currentRole = role;
  currentTopicHex = topicHex;
  activeSessionCode = sessionCode;
  activeSessionId = sessionId;
  swarm = new Hyperswarm();

  swarm.on('connection', (socket, info) => {
    if (campaignCore) {
      campaignCore.replicate(socket);
    }

    const publicKey = socket.remotePublicKey || info.publicKey;
    const peerId = b4a.toString(publicKey, 'hex').slice(0, 12);
    const state = { id: peerId, socket, buffer: '' };

    peers.set(peerId, state);

    send({
      type: 'peer-open',
      peerId,
      connectionCount: peers.size,
    });

    if (currentRole === 'host' && campaignCore) {
      const handshake = b4a.from(
        JSON.stringify({
          type: 'session-info',
          campaignId: activeCampaignId,
          coreKey: b4a.toString(campaignCore.key, 'hex'),
          sessionCode: activeSessionCode,
          sessionId: activeSessionId,
        }) + '\n',
      );
      socket.write(handshake);
    }

    socket.on('data', (data) => {
      state.buffer += b4a.toString(data);

      while (true) {
        const boundary = state.buffer.indexOf('\n');
        if (boundary === -1) break;

        const line = state.buffer.slice(0, boundary).trim();
        state.buffer = state.buffer.slice(boundary + 1);

        if (!line) continue;

        try {
          const packet = JSON.parse(line);

          if (packet.type === 'session-info' && currentRole === 'join') {
            handleSessionInfo(packet).catch((error) => {
              send({
                type: 'error',
                message: error.message,
              });
            });
            continue;
          }

          if (packet.type === 'remote-put' && currentRole === 'host') {
            handleRemotePut(packet, socket).catch((error) => {
              socket.write(
                b4a.from(
                  JSON.stringify({
                    type: 'remote-put-result',
                    requestId: packet.requestId,
                    ok: false,
                    message: error.message,
                  }) + '\n',
                ),
              );
            });
            continue;
          }

          if (packet.type === 'remote-put-result' && currentRole === 'join') {
            handleRemotePutResult(packet);
            continue;
          }

          if (packet.type === 'chat') {
            send({
              type: 'chat',
              peerId,
              author: packet.author || peerId,
              text: packet.text || '',
              inbound: true,
            });
          }
        } catch (error) {
          send({
            type: 'status',
            message: `Dropped malformed peer packet from ${peerId}: ${error.message}`,
          });
        }
      }
    });

    socket.on('error', (error) => {
      send({
        type: 'status',
        message: `Peer ${peerId} error: ${error.message}`,
      });
    });

    socket.on('close', () => {
      peers.delete(peerId);
      send({
        type: 'peer-closed',
        peerId,
        connectionCount: peers.size,
      });
    });
  });

  swarm.on('update', () => {
    send({
      type: 'metrics',
      peers: peers.size,
      connecting: swarm.connecting,
    });
  });

  const topic = b4a.from(currentTopicHex, 'hex');
  const isHost = currentRole === 'host';

  send({
    type: 'status',
    message: isHost ? 'Announcing room on the DHT...' : 'Looking up room on the DHT...',
  });

  discovery = swarm.join(topic, {
    server: isHost,
    client: !isHost,
  });

  if (campaignCore) {
    campaignDiscovery = swarm.join(campaignCore.discoveryKey, {
      server: isHost,
      client: true,
    });
  }

  if (isHost) {
    await discovery.flushed();
  } else {
    await swarm.flush();
    if (campaignCore) {
      await campaignCore.update();
    }
  }

  send({
    type: 'ready',
    role: currentRole,
    alias: currentAlias,
    topicHex: currentTopicHex,
  });
}

async function handleRemotePut(packet, socket) {
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

  socket.write(
    b4a.from(
      JSON.stringify({
        type: 'remote-put-result',
        requestId: packet.requestId,
        ok: true,
      }) + '\n',
    ),
  );
}

function handleRemotePutResult(packet) {
  const waiter = remotePutWaiters.get(packet.requestId);

  if (!waiter) {
    return;
  }

  remotePutWaiters.delete(packet.requestId);

  if (packet.ok) {
    waiter.resolve();
    return;
  }

  waiter.reject(new Error(packet.message || 'Host rejected the write.'));
}

async function handleSessionInfo(packet) {
  const campaignId = String(packet.campaignId || '').trim();
  const coreKey = String(packet.coreKey || '').trim();
  const sessionCode = packet.sessionCode ? String(packet.sessionCode).trim().toUpperCase() : null;
  const sessionId = packet.sessionId ? String(packet.sessionId).trim() : null;

  if (!campaignId || !coreKey) {
    throw new Error('Invalid session info from host.');
  }

  activeSessionCode = sessionCode;
  activeSessionId = sessionId;

  if (activeCampaignId === campaignId && campaignCore) {
    await campaignCore.update();
    send({
      type: 'campaign-opened',
      campaignId,
      coreKey: b4a.toString(campaignCore.key, 'hex'),
      discoveryKey: b4a.toString(campaignCore.discoveryKey, 'hex'),
      writable: campaignCore.writable,
    });
    return;
  }

  await openCampaign({ campaignId, coreKey }, { silent: true });
  await campaignCore.update();

  send({
    type: 'campaign-opened',
    campaignId,
    coreKey: b4a.toString(campaignCore.key, 'hex'),
    discoveryKey: b4a.toString(campaignCore.discoveryKey, 'hex'),
    writable: campaignCore.writable,
  });
}

function broadcastChat(message) {
  if (!swarm) {
    throw new Error('Start the swarm before sending messages.');
  }

  const text = String(message.text || '').trim();

  if (!text) return;

  if (peers.size === 0) {
    send({
      type: 'status',
      message: 'No peer connected yet.',
    });
    return;
  }

  const packet = b4a.from(
    JSON.stringify({
      type: 'chat',
      author: currentAlias,
      text,
    }) + '\n',
  );

  for (const peer of peers.values()) {
    peer.socket.write(packet);
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
  const closing = [];

  for (const peer of peers.values()) {
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
    await Promise.allSettled(closing);
  }

  if (campaignDiscovery) {
    await campaignDiscovery.close();
    campaignDiscovery = null;
  }

  if (swarm) {
    await swarm.destroy({ force: true });
  }

  swarm = null;
  discovery = null;
  currentRole = null;
  currentTopicHex = null;
  activeSessionCode = null;
  activeSessionId = null;
}

function ensureStore() {
  if (!store) {
    throw new Error('Storage has not been initialized.');
  }
}

function send(message) {
  log('event', message);
  IPC.write(b4a.from(JSON.stringify(message) + '\n'));
}

function log(label, data) {
  console.log(`[holepunch:worklet] ${label}`, data);
}
