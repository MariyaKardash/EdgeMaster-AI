export type CampaignSessionInfo = {
  name: string;
  sessionNumber: number;
  lastPlayed: string;
};

export type ContinueCampaignCardProps = {
  session: CampaignSessionInfo;
  onPress: () => void;
};
