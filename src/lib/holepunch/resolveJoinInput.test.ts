import { sessionIdFromCampaignId } from '@/database/utils/session-code';
import { campaignTopicHex } from '@/lib/holepunch/sessionTopicHex';

import { isValidJoinInput, resolveJoinInput } from './resolveJoinInput';

describe('resolveJoinInput', () => {
  const campaignId = '0ca32582-d288-4ab8-a5fc-239d0e0bbfc7';
  const sessionCode = sessionIdFromCampaignId(campaignId);
  const topicHex = campaignTopicHex(campaignId);

  it('accepts a campaign session code', () => {
    expect(isValidJoinInput(sessionCode)).toBe(true);

    const resolved = resolveJoinInput(sessionCode);

    expect(resolved).toEqual({
      kind: 'sessionCode',
      sessionCode,
      topicHex,
    });
  });

  it('accepts a topic hex', () => {
    expect(isValidJoinInput(topicHex)).toBe(true);

    const resolved = resolveJoinInput(topicHex);

    expect(resolved).toEqual({
      kind: 'topicHex',
      topicHex,
    });
  });

  it('rejects invalid input', () => {
    expect(isValidJoinInput('ab')).toBe(false);
    expect(() => resolveJoinInput('ab')).toThrow(/valid session code/i);
  });
});
