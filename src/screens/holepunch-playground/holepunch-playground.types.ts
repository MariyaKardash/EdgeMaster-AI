import type { HolepunchRole } from '@/lib/holepunch';

export type HolepunchPlaygroundPhase = 'idle' | 'starting' | 'ready';

export type TimelineTone = 'system' | 'local' | 'remote' | 'error';

export type TimelineEntry = {
  id: string;
  tone: TimelineTone;
  title: string;
  body: string;
};

export type HolepunchPlaygroundScreenProps = {
  initialRole?: HolepunchRole;
  initialRoom?: string;
};
