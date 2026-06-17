export type CampaignSessionInfo = {
  campaignId: string;
  name: string;
  lastPlayed: string;
  topicHex?: string;
};

export type ContinueCampaignCardProps = {
  session: CampaignSessionInfo;
  onPress: () => void;
};
