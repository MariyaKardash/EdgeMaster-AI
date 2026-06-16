import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

export type PartyEquippedItem = {
  id: string;
  name: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
};

export type PartyPlayerStats = {
  str: number;
  dex: number;
  int: number;
};

export type PartyPlayer = {
  id: string;
  name: string;
  race: string;
  imageUri: string;
  hp: { current: number; max: number };
  stats: PartyPlayerStats;
  equippedItems: PartyEquippedItem[];
};

export type PartyPlayerCardProps = {
  player: PartyPlayer;
  onPlayerChange?: (player: PartyPlayer) => void;
  onEquipHero?: (player: PartyPlayer) => void;
};
