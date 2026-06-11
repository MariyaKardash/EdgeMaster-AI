import { View } from 'react-native';

import { Dot } from '@/components/atoms/dot';
import { Text } from '@/components/atoms/text';
import { styles } from './role-badge.styles';
import type { RoleBadgeProps } from './role-badge.types';

export function RoleBadge({ label, color }: RoleBadgeProps) {
  return (
    <View style={styles.badge}>
      <Dot color={color} />
      <Text variant="roleBadgeLabel">{label}</Text>
    </View>
  );
}
