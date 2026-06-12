import { topicHexFromRoom } from './topicHexFromRoom';

const DEFAULT_TOPIC_HEX = '686f6c6570756e63682d706c617967726f756e64686f6c6570756e63682d706c';

describe('topicHexFromRoom', () => {
  it('returns a 32-byte lowercase hex string', () => {
    const topicHex = topicHexFromRoom('room');

    expect(topicHex).toHaveLength(64);
    expect(topicHex).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic for the same room', () => {
    expect(topicHexFromRoom('holepunch-demo')).toBe(topicHexFromRoom('holepunch-demo'));
  });

  it('trims whitespace before hashing', () => {
    expect(topicHexFromRoom('  room  ')).toBe(topicHexFromRoom('room'));
  });

  it('falls back to the default room when input is empty', () => {
    expect(topicHexFromRoom('')).toBe(DEFAULT_TOPIC_HEX);
  });

  it('falls back to the default room when input is whitespace only', () => {
    expect(topicHexFromRoom('   ')).toBe(DEFAULT_TOPIC_HEX);
  });

  it('repeats short room names to fill 32 bytes', () => {
    expect(topicHexFromRoom('ab')).toBe(
      '6162616261626162616261626162616261626162616261626162616261626162',
    );
    expect(topicHexFromRoom('room')).toBe(
      '726f6f6d726f6f6d726f6f6d726f6f6d726f6f6d726f6f6d726f6f6d726f6f6d',
    );
  });
});
