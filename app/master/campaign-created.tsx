import { useMemo } from 'react';
import { useRouter } from 'expo-router';

import { CampaignCreatedScreen, generateSessionId } from '@/screens/master/campaign-created';

const CampaignCreatedRoute = () => {
  const router = useRouter();
  const sessionId = useMemo(() => generateSessionId(), []);

  return (
    <CampaignCreatedScreen
      sessionId={sessionId}
      onOpenDashboard={() => {
        router.replace({
          pathname: '/master/session-dashboard',
          params: { sessionId },
        });
      }}
    />
  );
};

export default CampaignCreatedRoute;
