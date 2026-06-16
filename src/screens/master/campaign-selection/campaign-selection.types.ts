import type { CampaignSessionInfo } from '@/components/molecules/continue-campaign-card';

export type { CampaignSessionInfo };

export type CampaignSelectionScreenProps = {
  campaigns?: CampaignSessionInfo[];
  isLoading?: boolean;
  campaignsLoading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onStartNew?: () => void;
  onContinue?: (session: CampaignSessionInfo) => void;
};
