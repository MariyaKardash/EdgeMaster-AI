import { randomUUID } from '@/lib/randomUUID';

const SESSION_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateSessionCode(length = 6) {
  let hex = '';

  while (hex.length < length * 2) {
    hex += randomUUID().replace(/-/g, '');
  }

  return Array.from({ length }, (_, index) => {
    const byte = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    return SESSION_CODE_ALPHABET[byte % SESSION_CODE_ALPHABET.length];
  }).join('');
}

export function normalizeSessionCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '');
}

export function isValidSessionCode(value: string) {
  const normalized = normalizeSessionCode(value);

  return normalized.length >= 4 && normalized.length <= 12 && /^[A-Z0-9-]+$/.test(normalized);
}
