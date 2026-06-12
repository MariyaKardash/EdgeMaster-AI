import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

export type ArtifactRarity = 'common' | 'rare' | 'epic';

export type ArtifactItem = {
  id: string;
  name: string;
  description: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  rarity: ArtifactRarity;
};

export type ArtifactItemCardProps = {
  item: ArtifactItem;
  available: boolean;
  onToggle: (available: boolean) => void;
};
