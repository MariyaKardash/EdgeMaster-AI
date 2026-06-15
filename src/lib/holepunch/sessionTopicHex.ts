import { topicHexFromRoom } from './topicHexFromRoom';
import { normalizeSessionCode } from '@/database/utils/session-code';

export function sessionTopicHex(sessionCode: string) {
  return topicHexFromRoom(normalizeSessionCode(sessionCode));
}
