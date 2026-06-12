import b4a from 'b4a';
import { Worklet } from 'react-native-bare-kit';

import runtimeBundle from './bare/p2p.bundle.js';
import { logHolepunch, logHolepunchEvent } from './holepunch-debug';
import type { HolepunchController, HolepunchEvent } from './holepunch-shared';

type Listener = (event: HolepunchEvent) => void;
type BareIpc = {
  on(event: 'data', listener: (chunk: Uint8Array) => void): void;
  write(data: Uint8Array): void;
};

export function createHolepunchController(listener: Listener): HolepunchController {
  const worklet = new Worklet();
  const ipc = worklet.IPC as unknown as BareIpc;
  let buffer = '';

  worklet.start('/p2p.bundle', runtimeBundle);

  ipc.on('data', (chunk: Uint8Array) => {
    buffer += b4a.toString(chunk);

    while (true) {
      const boundary = buffer.indexOf('\n');

      if (boundary === -1) {
        break;
      }

      const line = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 1);

      if (!line) {
        continue;
      }

      try {
        const event = JSON.parse(line) as HolepunchEvent;
        logHolepunchEvent('ipc-in', event);
        listener(event);
      } catch (error) {
        const parseError = {
          type: 'error' as const,
          message: error instanceof Error ? error.message : 'Failed to parse runtime event.',
        };
        logHolepunchEvent('ipc-in', parseError);
        listener(parseError);
      }
    }
  });

  return {
    start(config) {
      send(ipc, {
        type: 'start',
        ...config,
      });
    },
    sendChat(text) {
      send(ipc, {
        type: 'chat',
        text,
      });
    },
    stop() {
      send(ipc, {
        type: 'stop',
      });
    },
    dispose() {
      try {
        send(ipc, { type: 'stop' });
      } finally {
        worklet.terminate();
      }
    },
  };
}

function send(ipc: BareIpc, payload: Record<string, string>) {
  logHolepunch('ipc-out', payload.type ?? 'unknown', payload);
  ipc.write(b4a.from(JSON.stringify(payload) + '\n'));
}
