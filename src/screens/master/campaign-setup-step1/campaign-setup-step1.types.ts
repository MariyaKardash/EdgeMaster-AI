import type { CampaignSetupStep1Fields } from '@/database/entities';

export type CampaignSetupStep1FormValues = CampaignSetupStep1Fields;

export type CampaignSetupStep1ScreenProps = {
  onContinue?: (values: CampaignSetupStep1FormValues) => void;
  onBack?: () => void;
};
