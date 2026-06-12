import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type ButtonSecondaryProps = {
  title: string;
  onPress?: () => void;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  iconPosition?: 'leading' | 'trailing';
  fullWidth?: boolean;
  disabled?: boolean;
};
