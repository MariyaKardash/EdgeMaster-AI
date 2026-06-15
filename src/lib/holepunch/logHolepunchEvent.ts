import type { HolepunchLogSource } from './logHolepunch';
import { logHolepunch } from './logHolepunch';

export function logHolepunchEvent(source: HolepunchLogSource, event: { type: string }) {
  logHolepunch(source, event.type, event, { silent: event.type === 'metrics' });
}
