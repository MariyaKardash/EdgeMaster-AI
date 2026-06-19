import { spacing } from '@/theme/spacing';

import type { SessionDashboardNavTab } from './session-dashboard-bottom-nav.types';

export const TAB_BAR_HEIGHT = 64;

export const DEFAULT_ACTIVE_TAB = 'overview';

export const BOTTOM_INSET_MIN = 8;

export const FAB_OFFSET_ABOVE_TAB_BAR = spacing.lg;

export const getSessionDashboardBottomNavHeight = (bottomInset: number) =>
  TAB_BAR_HEIGHT + spacing.sm + Math.max(bottomInset, BOTTOM_INSET_MIN);

export const SESSION_DASHBOARD_TABS: SessionDashboardNavTab[] = [
  { id: 'overview', label: 'Overview', icon: 'build' },
  { id: 'chapters', label: 'Chapters', icon: 'menu-book' },
  { id: 'players', label: 'Players', icon: 'group' },
  { id: 'chat', label: 'Chat', icon: 'chat-bubble' },
];
