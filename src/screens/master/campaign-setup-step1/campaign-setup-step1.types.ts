export type CampaignSetupStep1FormValues = {
  campaignName: string;
  description: string;
};

export type CampaignSetupStep1ScreenProps = {
  onContinue?: (values: CampaignSetupStep1FormValues) => void;
  onBack?: () => void;
};
