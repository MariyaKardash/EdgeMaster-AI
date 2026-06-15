import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BOTTOM_INSET_MIN,
  DEFAULT_ACTIVE_TAB,
  SESSION_DASHBOARD_TABS,
} from './session-dashboard-bottom-nav.constants';
import { styles } from './session-dashboard-bottom-nav.styles';
import type { SessionDashboardBottomNavProps } from './session-dashboard-bottom-nav.types';
import { SessionDashboardNavTab } from './session-dashboard-nav-tab.component';

export const SessionDashboardBottomNav = ({
  activeTab = DEFAULT_ACTIVE_TAB,
  onTabPress,
}: SessionDashboardBottomNavProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, BOTTOM_INSET_MIN) }]}>
      {SESSION_DASHBOARD_TABS.map((tab) => (
        <SessionDashboardNavTab
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTab}
          onPress={() => onTabPress?.(tab.id)}
        />
      ))}
    </View>
  );
};
