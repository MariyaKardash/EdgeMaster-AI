import type { HolepunchEvent } from './initHolepunchController';
import type { HolepunchLogSource } from './logHolepunch';
import { logHolepunch } from './logHolepunch';

export function logHolepunchEvent(source: HolepunchLogSource, event: HolepunchEvent) {
  logHolepunch(source, event.type, event, { silent: event.type === 'metrics' });
}
