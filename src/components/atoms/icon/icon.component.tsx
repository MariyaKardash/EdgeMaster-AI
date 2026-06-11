import { MaterialIcons } from '@expo/vector-icons';

import { ColorToken, colors } from '@/theme';
import type { IconProps } from './icon.types';

export function Icon({ name, size = 24, color = 'primary' }: IconProps) {
  const resolvedColor = color in colors ? colors[color as ColorToken] : color;

  return <MaterialIcons name={name} size={size} color={resolvedColor} />;
}
