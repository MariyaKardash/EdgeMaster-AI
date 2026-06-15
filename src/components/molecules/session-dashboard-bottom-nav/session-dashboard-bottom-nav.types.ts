export type SessionDashboardTab = 'overview' | 'chapters' | 'players';

export type SessionDashboardTabIcon = 'build' | 'menu-book' | 'group';

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
