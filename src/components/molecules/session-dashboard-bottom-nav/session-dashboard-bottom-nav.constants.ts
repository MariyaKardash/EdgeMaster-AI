import type { SessionDashboardNavTab } from './session-dashboard-bottom-nav.types';

export const TAB_BAR_HEIGHT = 64;

export const DEFAULT_ACTIVE_TAB = 'overview';

export const BOTTOM_INSET_MIN = 8;

export const SESSION_DASHBOARD_TABS: SessionDashboardNavTab[] = [
  { id: 'overview', label: 'Overview', icon: 'build' },
  { id: 'chapters', label: 'Chapters', icon: 'menu-book' },
  { id: 'players', label: 'Players', icon: 'group' },
];
