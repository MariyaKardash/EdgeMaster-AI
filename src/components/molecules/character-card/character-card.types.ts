export type CharacterStats = {
  str: number;
  dex: number;
  int: number;
};

export type CharacterCardPlayer = {
  id: string;
  name: string;
  class: string;
  stats: CharacterStats;
  imageUri: string;
};

export type CharacterCardProps = {
  player: CharacterCardPlayer;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};
