export type CampaignSessionInfo = {
  campaignId: string;
  name: string;
  lastPlayed: string;
  lastPlayedAt: string;
  sessionCode?: string;
};

export type ContinueCampaignCardProps = {
  session: CampaignSessionInfo;
  onPress: () => void;
};
