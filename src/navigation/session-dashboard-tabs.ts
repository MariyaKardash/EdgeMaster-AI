import type { useRouter } from 'expo-router';

import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

type Router = ReturnType<typeof useRouter>;

export const navigateSessionDashboardTab = (
  router: Router,
  tab: SessionDashboardTab,
  campaignId?: string,
) => {
  const params = campaignId ? { campaignId } : undefined;

  switch (tab) {
    case 'overview':
      router.replace({ pathname: '/master/session-dashboard', params });
      break;
    case 'chapters':
      router.replace({ pathname: '/master/chapters-list', params });
      break;
    case 'players':
      router.replace({ pathname: '/master/party-status', params });
      break;
    case 'chat':
      router.replace({ pathname: '/master/chat', params });
      break;
  }
};
