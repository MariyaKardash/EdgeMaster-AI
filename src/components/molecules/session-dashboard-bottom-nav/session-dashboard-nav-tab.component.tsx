import { Pressable } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { styles } from './session-dashboard-bottom-nav.styles';
import type { SessionDashboardNavTabProps } from './session-dashboard-bottom-nav.types';

export const SessionDashboardNavTab = ({ tab, isActive, onPress }: SessionDashboardNavTabProps) => {
  styles.useVariants({ active: isActive });

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={tab.label}
    >
      <Icon name={tab.icon} size={24} color={isActive ? 'primary' : 'onSurfaceVariant'} />
      <Text variant="labelMd" style={styles.tabLabel}>
        {tab.label}
      </Text>
    </Pressable>
  );
};
