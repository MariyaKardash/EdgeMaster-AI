const Hyperswarm = require('hyperswarm');
const b4a = require('b4a');

const { IPC } = BareKit;

let swarm = null;
let discovery = null;
let currentRole = null;
let currentAlias = 'device';
let currentTopicHex = null;
let inputBuffer = '';
const peers = new Map();

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
      });
    });
  }
});

async function handleCommand(message) {
  log('command', message);

  switch (message.type) {
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
      });
  }
}

async function startSwarm(message) {
  await stopSwarm();

  const topicHex = String(message.topicHex || '');
  const alias = String(message.alias || 'device').trim() || 'device';
  const role = message.role === 'join' ? 'join' : 'host';

  if (!/^[0-9a-f]{64}$/i.test(topicHex)) {
    throw new Error('Topic must be a 64 character hex string.');
  }

  currentAlias = alias;
  currentRole = role;
  currentTopicHex = topicHex.toLowerCase();
  swarm = new Hyperswarm();

  swarm.on('connection', (socket, info) => {
    const publicKey = socket.remotePublicKey || info.publicKey;
    const peerId = b4a.toString(publicKey, 'hex').slice(0, 12);
    const state = { id: peerId, socket, buffer: '' };

    peers.set(peerId, state);

    send({
      type: 'peer-open',
      peerId,
      connectionCount: peers.size,
    });

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

  if (isHost) {
    await discovery.flushed();
  } else {
    await swarm.flush();
  }

  send({
    type: 'ready',
    role: currentRole,
    alias: currentAlias,
    topicHex: currentTopicHex,
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

  if (closing.length > 0) {
    await Promise.allSettled(closing);
  }

  if (swarm) {
    await swarm.destroy({ force: true });
  }

  swarm = null;
  discovery = null;
  currentRole = null;
  currentTopicHex = null;
}

function send(message) {
  log('event', message);
  IPC.write(b4a.from(JSON.stringify(message) + '\n'));
}

function log(label, data) {
  console.log(`[holepunch:worklet] ${label}`, data);
}
