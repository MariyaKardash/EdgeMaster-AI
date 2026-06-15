const SESSION_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateSessionCode(length = 6) {
  const bytes = new Uint8Array(length);

  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) => SESSION_CODE_ALPHABET[byte % SESSION_CODE_ALPHABET.length],
  ).join('');
}

export function normalizeSessionCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '');
}

export function isValidSessionCode(value: string) {
  const normalized = normalizeSessionCode(value);

  return normalized.length >= 4 && normalized.length <= 12 && /^[A-Z0-9-]+$/.test(normalized);
}
