import { View } from 'react-native';

import type { DotProps } from './dot.types';

export function Dot({ color, size = 6, style }: DotProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}
