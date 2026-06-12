import type { ArtifactItem } from '@/components/molecules/artifact-item-card';

export type CampaignSetupStep3ScreenProps = {
  onFinalize?: (availableItemIds: string[]) => void;
  onBack?: () => void;
};

export type { ArtifactItem };
