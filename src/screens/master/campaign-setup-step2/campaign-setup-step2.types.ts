import type { CharacterCardPlayer } from '@/components/molecules/character-card';

export type CampaignCharacter = CharacterCardPlayer;

export type CampaignSetupStep2ScreenProps = {
  onContinue?: (selectedCharacterIds: string[]) => void;
  onBack?: () => void;
};
