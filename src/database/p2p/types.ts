import type {
  Campaign,
  Chapter,
  CharacterTemplate,
  GameEvent,
  ItemHistoryEntry,
  ItemTemplate,
  Player,
  PlayerCharacter,
  PlayerItem,
  Session,
  StatsHistoryEntry,
} from '../entities';

export type P2pDbEntity =
  | Campaign
  | Chapter
  | Session
  | CharacterTemplate
  | ItemTemplate
  | Player
  | PlayerCharacter
  | PlayerItem
  | GameEvent
  | StatsHistoryEntry
  | ItemHistoryEntry;

export type P2pDbValue = P2pDbEntity | string[] | string;

export type P2pWorkletEvent =
  | { type: 'runtime-ready'; storagePath: string | null }
  | { type: 'status'; message: string }
  | { type: 'error'; message: string; requestId?: string }
  | { type: 'stopped' }
  | { type: 'ready'; role: 'host' | 'join'; alias: string; topicHex: string }
  | { type: 'peer-open'; peerId: string; connectionCount: number }
  | { type: 'peer-closed'; peerId: string; connectionCount: number }
  | { type: 'metrics'; peers: number; connecting: number }
  | {
      type: 'campaign-opened';
      campaignId: string;
      coreKey: string;
      discoveryKey: string;
      writable: boolean;
    }
  | { type: 'db-put'; key: string; value: P2pDbValue | null }
  | { type: 'db-del'; key: string }
  | {
      type: 'db-list-result';
      requestId: string;
      entries: { key: string; value: P2pDbValue }[];
    }
  | { type: 'db-get-result'; requestId: string; key: string; value: P2pDbValue | null }
  | { type: 'db-put-result'; requestId: string; key: string; ok: boolean }
  | { type: 'db-del-result'; requestId: string; key: string; ok: boolean }
  | { type: 'campaign-closed'; requestId: string };

export type P2pWorkletCommand =
  | { type: 'init'; storagePath: string }
  | { type: 'open-campaign'; campaignId: string; coreKey?: string }
  | { type: 'close-campaign'; requestId?: string }
  | { type: 'put'; requestId: string; key: string; value: P2pDbValue }
  | { type: 'get'; requestId: string; key: string }
  | { type: 'del'; requestId: string; key: string }
  | { type: 'list'; requestId: string; gte: string; lt: string }
  | {
      type: 'start-swarm';
      role: 'host' | 'join';
      alias: string;
      topicHex: string;
      sessionCode?: string;
      sessionId?: string;
    }
  | { type: 'stop-swarm' };

export interface P2pWorkletClient {
  init(storagePath: string): Promise<void>;
  openCampaign(
    campaignId: string,
    coreKey?: string,
  ): Promise<{
    campaignId: string;
    coreKey: string;
    discoveryKey: string;
    writable: boolean;
  }>;
  closeCampaign(): Promise<void>;
  put(key: string, value: P2pDbValue): Promise<void>;
  get<T extends P2pDbValue>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
  list<T extends P2pDbValue>(gte: string, lt: string): Promise<{ key: string; value: T }[]>;
  startSwarm(config: {
    role: 'host' | 'join';
    alias: string;
    topicHex: string;
    sessionCode?: string;
    sessionId?: string;
  }): Promise<void>;
  stopSwarm(): Promise<void>;
  dispose(): void;
  onEvent(listener: (event: P2pWorkletEvent) => void): () => void;
  waitForCampaignOpened(timeoutMs?: number): Promise<{
    campaignId: string;
    coreKey: string;
    discoveryKey: string;
    writable: boolean;
  }>;
  waitForDbKey(key: string, timeoutMs?: number): Promise<P2pDbValue>;
}
