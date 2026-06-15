import { dbKeys, dbPrefixEnd } from '@/database/keys';
import {
  generateSessionCode,
  isValidSessionCode,
  normalizeSessionCode,
} from '@/database/utils/session-code';
import { sessionTopicHex } from '@/lib/holepunch/sessionTopicHex';

describe('session code utilities', () => {
  it('normalizes session codes', () => {
    expect(normalizeSessionCode(' ab12cd ')).toBe('AB12CD');
  });

  it('validates session codes', () => {
    expect(isValidSessionCode('AB12CD')).toBe(true);
    expect(isValidSessionCode('ab')).toBe(false);
  });

  it('generates readable session codes', () => {
    const code = generateSessionCode();

    expect(code).toHaveLength(6);
    expect(isValidSessionCode(code)).toBe(true);
  });
});

describe('sessionTopicHex', () => {
  it('derives a stable 64-char topic hex from a session code', () => {
    const topic = sessionTopicHex('AB12CD');

    expect(topic).toHaveLength(64);
    expect(topic).toBe(sessionTopicHex('ab12cd'));
  });
});

describe('dbKeys', () => {
  it('builds collection and index keys', () => {
    expect(dbKeys.campaign('123')).toBe('@campaign/123');
    expect(dbKeys.indexSessionByCode('ab12cd')).toBe('@idx/session-code/AB12CD');
    expect(dbPrefixEnd('@chapter/')).toBe('@chapter/\xff');
  });
});
