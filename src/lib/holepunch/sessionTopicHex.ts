import { normalizeSessionCode, sessionIdFromCampaignId } from '@/database/utils/session-code';

import { topicHexFromRoom } from './topicHexFromRoom';

export function sessionTopicHex(sessionCode: string) {
  return topicHexFromRoom(normalizeSessionCode(sessionCode));
}

export function campaignTopicHex(campaignId: string) {
  return sessionTopicHex(sessionIdFromCampaignId(campaignId));
}
