import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { ColorToken } from '@/theme';

export type IconProps = {
  name: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color?: string | ColorToken;
};
