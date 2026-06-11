import { View } from 'react-native';

import { RoleBadge } from '@/components/molecules/role-badge';
import { styles } from './role-badge-row.styles';
import type { RoleBadgeRowProps } from './role-badge-row.types';

export function RoleBadgeRow({ roles }: RoleBadgeRowProps) {
  return (
    <View style={styles.row}>
      {roles.map((role) => (
        <RoleBadge key={role.label} label={role.label} color={role.color} />
      ))}
    </View>
  );
}
