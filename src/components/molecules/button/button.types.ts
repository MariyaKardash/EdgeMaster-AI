import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  iconSize?: number;
  fullWidth?: boolean;
  disabled?: boolean;
};
