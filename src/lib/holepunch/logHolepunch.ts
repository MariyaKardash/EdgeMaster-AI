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
