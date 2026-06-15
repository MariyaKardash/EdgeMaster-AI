import { useMemo } from 'react';

import { CampaignCreatedScreen, generateSessionId } from '@/screens/master/campaign-created';

const CampaignCreatedRoute = () => {
  const sessionId = useMemo(() => generateSessionId(), []);

  return (
    <CampaignCreatedScreen
      sessionId={sessionId}
      onOpenDashboard={() => {
        // TODO: navigate to session dashboard
      }}
    />
  );
};

export default CampaignCreatedRoute;
