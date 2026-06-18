import { isValidSessionCode, normalizeSessionCode } from '@/database/utils/session-code';

import { isValidTopicHex, normalizeTopicHex } from './topicHex';
import { sessionTopicHex } from './sessionTopicHex';

export type ResolvedJoinInput =
  | { kind: 'sessionCode'; sessionCode: string; topicHex: string }
  | { kind: 'topicHex'; topicHex: string };

export function isValidJoinInput(value: string) {
  const trimmed = value.trim();

  return isValidTopicHex(trimmed) || isValidSessionCode(trimmed);
}

export function resolveJoinInput(value: string): ResolvedJoinInput {
  const trimmed = value.trim();

  if (isValidTopicHex(trimmed)) {
    return { kind: 'topicHex', topicHex: normalizeTopicHex(trimmed) };
  }

  if (isValidSessionCode(trimmed)) {
    const sessionCode = normalizeSessionCode(trimmed);

    return {
      kind: 'sessionCode',
      sessionCode,
      topicHex: sessionTopicHex(sessionCode),
    };
  }

  throw new Error('Enter a valid session code (e.g. NDFC-UJL2) or 64-character topic hex.');
}
