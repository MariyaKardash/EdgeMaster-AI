export function normalizeTopicHex(value: string) {
  return value.trim().toLowerCase();
}

export function isValidTopicHex(value: string) {
  return /^[0-9a-f]{64}$/.test(normalizeTopicHex(value));
}
