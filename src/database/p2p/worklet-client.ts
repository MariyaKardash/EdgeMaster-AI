import b4a from 'b4a';
import { Worklet } from 'react-native-bare-kit';

import runtimeBundle from '@/lib/holepunch/bare/p2p.bundle.js';
import { logHolepunch } from '@/lib/holepunch/logHolepunch';
import { logHolepunchEvent } from '@/lib/holepunch/logHolepunchEvent';
import { randomUUID } from '@/lib/randomUUID';

import type { P2pDbValue, P2pWorkletClient, P2pWorkletCommand, P2pWorkletEvent } from './types';

type BareIpc = {
  on(event: 'data', listener: (chunk: Uint8Array) => void): void;
  write(data: Uint8Array): void;
};

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
};

function createRequestId() {
  return randomUUID();
}

function send(ipc: BareIpc, payload: P2pWorkletCommand | Record<string, unknown>) {
  logHolepunch('ipc-out', String(payload.type ?? 'unknown'), payload);
  ipc.write(b4a.from(JSON.stringify(payload) + '\n'));
}

export function createP2pWorkletClient(): P2pWorkletClient {
  const worklet = new Worklet();
  const ipc = worklet.IPC as unknown as BareIpc;
  let buffer = '';
  let initialized = false;
  let initPromise: Promise<void> | null = null;
  let listeners = new Set<(event: P2pWorkletEvent) => void>();
  const pending = new Map<string, PendingRequest>();

  worklet.start('/p2p.bundle', runtimeBundle);

  const emit = (event: P2pWorkletEvent) => {
    logHolepunchEvent('ipc-in', event);
    listeners.forEach((listener) => listener(event));
  };

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
        const event = JSON.parse(line) as P2pWorkletEvent & { requestId?: string };
        const requestId = typeof event.requestId === 'string' ? event.requestId : null;

        if (requestId && pending.has(requestId)) {
          const current = pending.get(requestId);

          if (!current) {
            continue;
          }

          pending.delete(requestId);

          if (event.type === 'error') {
            current.reject(new Error(event.message));
            continue;
          }

          if (event.type === 'db-get-result') {
            current.resolve(event.value);
            continue;
          }

          if (event.type === 'db-list-result') {
            current.resolve(event.entries);
            continue;
          }

          if (
            event.type === 'db-put-result' ||
            event.type === 'db-del-result' ||
            event.type === 'campaign-closed'
          ) {
            current.resolve(undefined);
            continue;
          }
        }

        emit(event);
      } catch (error) {
        emit({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to parse runtime event.',
        });
      }
    }
  });

  const waitFor = <T>(requestId: string, timeoutMs = 30_000) =>
    new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(requestId);
        reject(new Error('P2P worklet request timed out.'));
      }, timeoutMs);

      pending.set(requestId, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value as T);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
    });

  const onEvent = (listener: (event: P2pWorkletEvent) => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const ensureInit = async (storagePath: string) => {
    if (initialized) {
      return;
    }

    if (initPromise) {
      await initPromise;
      return;
    }

    initPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        initPromise = null;
        reject(new Error('P2P worklet init timed out.'));
      }, 30_000);

      const unsubscribe = onEvent((event) => {
        if (event.type === 'error') {
          clearTimeout(timeout);
          unsubscribe();
          initPromise = null;
          reject(new Error(event.message));
        }

        if (event.type === 'status' && event.message === 'Storage ready.') {
          clearTimeout(timeout);
          unsubscribe();
          initialized = true;
          resolve();
        }
      });

      send(ipc, { type: 'init', storagePath });
    });

    try {
      await initPromise;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  };

  const requireInit = () => {
    if (!initialized) {
      throw new Error('P2P storage has not been initialized.');
    }
  };

  const client: P2pWorkletClient = {
    async init(storagePath) {
      await ensureInit(storagePath);
    },
    async openCampaign(campaignId, coreKey) {
      requireInit();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error('Opening campaign timed out.'));
        }, 30_000);

        const unsubscribe = onEvent((event) => {
          if (event.type === 'campaign-opened' && event.campaignId === campaignId) {
            clearTimeout(timeout);
            unsubscribe();
            resolve({
              campaignId: event.campaignId,
              coreKey: event.coreKey,
              discoveryKey: event.discoveryKey,
              writable: event.writable,
            });
          }
        });

        send(ipc, { type: 'open-campaign', campaignId, coreKey });
      });
    },
    async closeCampaign() {
      requireInit();
      const requestId = createRequestId();
      const result = waitFor<void>(requestId);
      send(ipc, { type: 'close-campaign', requestId });
      await result;
    },
    async put(key, value) {
      requireInit();
      const requestId = createRequestId();
      const result = waitFor<void>(requestId);
      send(ipc, { type: 'put', requestId, key, value });
      await result;
    },
    async get<T extends P2pDbValue>(key: string) {
      requireInit();
      const requestId = createRequestId();
      const result = waitFor<T | null>(requestId);
      send(ipc, { type: 'get', requestId, key });
      return result;
    },
    async del(key) {
      requireInit();
      const requestId = createRequestId();
      const result = waitFor<void>(requestId);
      send(ipc, { type: 'del', requestId, key });
      await result;
    },
    async list<T extends P2pDbValue>(gte: string, lt: string) {
      requireInit();
      const requestId = createRequestId();
      const result = waitFor<{ key: string; value: T }[]>(requestId);
      send(ipc, { type: 'list', requestId, gte, lt });
      return result;
    },
    async startSwarm(config) {
      requireInit();

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error('Starting swarm timed out.'));
        }, 60_000);

        const unsubscribe = onEvent((event) => {
          if (event.type === 'error') {
            clearTimeout(timeout);
            unsubscribe();
            reject(new Error(event.message));
          }

          if (
            event.type === 'ready' &&
            event.role === config.role &&
            event.topicHex === config.topicHex.toLowerCase()
          ) {
            clearTimeout(timeout);
            unsubscribe();
            resolve();
          }
        });

        send(ipc, {
          type: 'start-swarm',
          ...config,
          topicHex: config.topicHex.toLowerCase(),
        });
      });
    },
    async stopSwarm() {
      if (!initialized) {
        return;
      }

      send(ipc, { type: 'stop-swarm' });
    },
    dispose() {
      try {
        send(ipc, { type: 'stop-swarm' });
        send(ipc, { type: 'close-campaign' });
      } finally {
        worklet.terminate();
        listeners.clear();
        pending.clear();
        initialized = false;
        initPromise = null;
      }
    },
    onEvent,
    waitForCampaignOpened(timeoutMs = 30_000) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error('Timed out waiting for campaign replication.'));
        }, timeoutMs);

        const unsubscribe = onEvent((event) => {
          if (event.type === 'campaign-opened') {
            clearTimeout(timeout);
            unsubscribe();
            resolve({
              campaignId: event.campaignId,
              coreKey: event.coreKey,
              discoveryKey: event.discoveryKey,
              writable: event.writable,
            });
          }
        });
      });
    },
    async waitForDbKey(key, timeoutMs = 30_000) {
      requireInit();
      const startedAt = Date.now();

      while (Date.now() - startedAt < timeoutMs) {
        const value = await client.get<P2pDbValue>(key);

        if (value !== null) {
          return value;
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      throw new Error(`Timed out waiting for database key: ${key}`);
    },
  };

  return client;
}
