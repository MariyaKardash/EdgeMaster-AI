import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { LLMChatScreen } from '@/screens/llm-chat';

export default function DevChatRoute() {
  return (
    <LLMChatScreen
      campaignId={MOCK_CAMPAIGN.id}
      campaignName={MOCK_CAMPAIGN.name}
      userRole="master"
    />
  );
}
