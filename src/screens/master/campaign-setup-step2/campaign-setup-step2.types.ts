import type { CharacterCardPlayer } from '@/components/molecules/character-card';

export type CampaignCharacter = CharacterCardPlayer;

export type HeroStats = {
  str: string;
  dex: string;
  int: string;
};

export type NewHeroForm = {
  name: string;
  archetype: string;
  origin: string;
};

export type CampaignSetupStep2ScreenProps = {
  onContinue?: () => void;
  onBack?: () => void;
};
