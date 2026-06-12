import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type RoleCardIcon = ComponentProps<typeof MaterialIcons>['name'];

export type RoleCardProps = {
  title: string;
  description: string;
  icon: RoleCardIcon;
  overlayIcon?: RoleCardIcon;
  accentColor: string;
  selected?: boolean;
  onPress?: () => void;
};
