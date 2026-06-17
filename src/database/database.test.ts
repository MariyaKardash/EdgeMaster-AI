import { dbKeys, dbPrefixEnd } from '@/database/keys';
import {
  generateSessionCode,
  isValidSessionCode,
  normalizeSessionCode,
  sessionIdFromCampaignId,
} from '@/database/utils/session-code';
import { campaignTopicHex, sessionTopicHex } from '@/lib/holepunch/sessionTopicHex';

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

describe('sessionIdFromCampaignId', () => {
  it('derives a stable join code from a campaign id', () => {
    const campaignId = '550e8400-e29b-41d4-a716-446655440000';
    const sessionCode = sessionIdFromCampaignId(campaignId);

    expect(sessionCode).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    expect(sessionIdFromCampaignId(campaignId)).toBe(sessionCode);
  });
});

describe('sessionTopicHex', () => {
  it('derives a stable 64-char topic hex from a session code', () => {
    const topic = sessionTopicHex('AB12CD');

    expect(topic).toHaveLength(64);
    expect(topic).toBe(sessionTopicHex('ab12cd'));
  });

  it('derives the same topic hex from a campaign id and its join code', () => {
    const campaignId = '550e8400-e29b-41d4-a716-446655440000';
    const sessionCode = sessionIdFromCampaignId(campaignId);

    expect(campaignTopicHex(campaignId)).toBe(sessionTopicHex(sessionCode));
  });
});

describe('campaignTopicHex', () => {
  it('returns the same topic hex for the same campaign id', () => {
    const campaignId = '550e8400-e29b-41d4-a716-446655440000';
    const topic = campaignTopicHex(campaignId);

    expect(topic).toHaveLength(64);
    expect(topic).toMatch(/^[0-9a-f]{64}$/);
    expect(campaignTopicHex(campaignId)).toBe(topic);
    expect(campaignTopicHex('550E8400-E29B-41D4-A716-446655440000')).toBe(topic);
  });
});

describe('dbKeys', () => {
  it('builds collection and index keys', () => {
    expect(dbKeys.campaign('123')).toBe('@campaign/123');
    expect(dbKeys.indexSessionByCode('ab12cd')).toBe('@idx/session-code/AB12CD');
    expect(
      dbKeys.indexSessionByTopicHex(
        'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
      ),
    ).toBe('@idx/session-topic/abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789');
    expect(dbPrefixEnd('@chapter/')).toBe('@chapter/\xff');
  });
});
