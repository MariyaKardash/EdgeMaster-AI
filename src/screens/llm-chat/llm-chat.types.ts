export type Role = 'user' | 'assistant' | 'system';

export type MessageStats = { ttftMs?: number; tps?: number };

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  stats?: MessageStats;
};

export type CampaignChatProps = {
  campaignId: string;
  campaignName: string;
  userRole?: 'master' | 'player';
};
