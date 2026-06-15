import type { useRouter } from 'expo-router';

import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

type Router = ReturnType<typeof useRouter>;

export const navigateSessionDashboardTab = (
  router: Router,
  tab: SessionDashboardTab,
  sessionId?: string,
) => {
  const params = sessionId ? { sessionId } : undefined;

  switch (tab) {
    case 'overview':
      router.replace({ pathname: '/master/session-dashboard', params });
      break;
    case 'chapters':
      router.replace({ pathname: '/master/chapters-list', params });
      break;
    case 'players':
      break;
  }
};
