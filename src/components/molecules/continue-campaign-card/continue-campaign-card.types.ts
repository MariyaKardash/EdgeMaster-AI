export type CampaignSessionInfo = {
  campaignId: string;
  name: string;
  sessionNumber: number;
  lastPlayed: string;
  topicHex?: string;
};

export type ContinueCampaignCardProps = {
  session: CampaignSessionInfo;
  onPress: () => void;
};
