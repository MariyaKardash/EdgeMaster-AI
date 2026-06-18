import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter } from '@/database';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { LiveControlScreen } from '@/screens/master/live-control';

const LiveControlRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const { openCampaign } = useCampaign();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    const resolvedCampaignId = campaignId;
    let cancelled = false;

    async function resolveActiveChapter() {
      try {
        const { chapter: activeChapter } = await openCampaign(resolvedCampaignId);

        if (cancelled) {
          return;
        }

        if (!activeChapter) {
          router.replace({
            pathname: '/master/session-dashboard',
            params: { campaignId: resolvedCampaignId },
          });
          return;
        }

        setChapter(activeChapter);
      } catch {
        if (!cancelled) {
          router.replace({
            pathname: '/master/session-dashboard',
            params: { campaignId: resolvedCampaignId },
          });
        }
      } finally {
        if (!cancelled) {
          setIsResolving(false);
        }
      }
    }

    void resolveActiveChapter();

    return () => {
      cancelled = true;
    };
  }, [campaignId, openCampaign, router]);

  if (!campaignId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isResolving || !chapter) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LiveControlScreen
      chapterId={chapter.id}
      onSummarizeAndEndChapter={() => {
        router.push({
          pathname: '/master/chapter-summarize',
          params: { chapterId: chapter.id, campaignId },
        });
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default LiveControlRoute;
