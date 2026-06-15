export type CampaignSessionInfo = {
  campaignId: string;
  name: string;
  sessionNumber: number;
  lastPlayed: string;
  sessionCode?: string;
};

export type ContinueCampaignCardProps = {
  session: CampaignSessionInfo;
  onPress: () => void;
};
