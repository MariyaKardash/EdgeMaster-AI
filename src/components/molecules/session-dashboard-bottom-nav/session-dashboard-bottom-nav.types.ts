export type SessionDashboardTab = 'overview' | 'chapters' | 'players' | 'chat';

export type SessionDashboardTabIcon = 'build' | 'menu-book' | 'group' | 'chat-bubble';

export type SessionDashboardNavTab = {
  id: SessionDashboardTab;
  label: string;
  icon: SessionDashboardTabIcon;
};

export type SessionDashboardBottomNavProps = {
  activeTab?: SessionDashboardTab;
  onTabPress?: (tab: SessionDashboardTab) => void;
};

export type SessionDashboardNavTabProps = {
  tab: SessionDashboardNavTab;
  isActive: boolean;
  onPress: () => void;
};
