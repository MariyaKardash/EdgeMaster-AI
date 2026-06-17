import { isValidTopicHex, normalizeTopicHex } from './topicHex';

describe('topicHex utilities', () => {
  const validTopicHex = 'a'.repeat(64);

  it('normalizes topic hex', () => {
    expect(normalizeTopicHex(` ${validTopicHex.toUpperCase()} `)).toBe(validTopicHex);
  });

  it('validates topic hex', () => {
    expect(isValidTopicHex(validTopicHex)).toBe(true);
    expect(isValidTopicHex('abc')).toBe(false);
    expect(isValidTopicHex(`${validTopicHex}0`)).toBe(false);
  });
});
