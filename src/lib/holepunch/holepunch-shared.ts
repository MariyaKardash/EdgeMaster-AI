export type HolepunchRole = 'host' | 'join';

export type HolepunchEvent =
  | { type: 'status'; message: string }
  | { type: 'error'; message: string }
  | { type: 'stopped' }
  | { type: 'ready'; role: HolepunchRole; alias: string; topicHex: string }
  | { type: 'peer-open'; peerId: string; connectionCount: number }
  | { type: 'peer-closed'; peerId: string; connectionCount: number }
  | { type: 'metrics'; peers: number; connecting: number }
  | { type: 'chat'; peerId: string; author: string; text: string; inbound: boolean };

export interface HolepunchController {
  start(config: { role: HolepunchRole; alias: string; topicHex: string }): void;
  sendChat(text: string): void;
  stop(): void;
  dispose(): void;
}

export function topicHexFromRoom(room: string) {
  const normalized = room.trim() || 'holepunch-playground';
  const bytes = new Uint8Array(32);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = normalized.charCodeAt(index % normalized.length) & 0xff;
  }

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function defaultAlias() {
  return `device-${Math.random().toString(36).slice(2, 6)}`;
}
