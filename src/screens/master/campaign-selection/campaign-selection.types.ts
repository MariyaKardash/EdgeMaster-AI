import type { CampaignSessionInfo } from '@/components/molecules/continue-campaign-card';

export type { CampaignSessionInfo };

export type CampaignSelectionScreenProps = {
  onBack?: () => void;
  onStartNew?: () => void;
  onContinue?: (session: CampaignSessionInfo) => void;
};
