import type { CharacterCardPlayer, CharacterStats } from '@/components/molecules/character-card';

export type { CharacterStats };
export type MockPlayer = CharacterCardPlayer;

export type CharacterSelectionScreenProps = {
  onBack?: () => void;
  onSelectCharacter?: (player: MockPlayer) => void;
};
