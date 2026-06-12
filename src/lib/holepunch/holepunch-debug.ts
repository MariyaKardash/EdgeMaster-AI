import type { HolepunchEvent } from './holepunch-shared';

export type HolepunchLogSource = 'ipc-in' | 'ipc-out' | 'ui' | 'worklet';

export function logHolepunch(
  source: HolepunchLogSource,
  label: string,
  data: unknown,
  options?: { silent?: boolean },
) {
  if (!__DEV__ || options?.silent) {
    return;
  }

  console.log(`[holepunch:${source}] ${label}`, data);
}

export function logHolepunchEvent(source: HolepunchLogSource, event: HolepunchEvent) {
  logHolepunch(source, event.type, event, { silent: event.type === 'metrics' });
}
