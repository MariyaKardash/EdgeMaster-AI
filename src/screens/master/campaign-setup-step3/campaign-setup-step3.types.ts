import type { ArtifactItem } from '@/components/molecules/artifact-item-card';

export type CampaignSetupStep3ScreenProps = {
  onFinalize?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
};

export type { ArtifactItem };
