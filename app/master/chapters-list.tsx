import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCampaign } from '@/contexts/campaign-context';
import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import type { ChapterListItem } from '@/screens/master/chapters-list/chapters-list.constants';
import { ChaptersListScreen } from '@/screens/master/chapters-list';

const ChaptersListRoute = () => {
  const router = useRouter();
  const { campaignId: paramCampaignId } = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = useCampaignId(
    typeof paramCampaignId === 'string' ? paramCampaignId : undefined,
  );
  const resolvedCampaignId = campaignId ?? MOCK_CAMPAIGN.id;

  const { listChapters } = useCampaign();
  const [chapters, setChapters] = useState<ChapterListItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    listChapters(resolvedCampaignId)
      .then((result) => {
        if (cancelled) return;
        if (result.length === 0) {
          setChapters([]);
          return;
        }
        setChapters(
          result.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            status: c.status,
            dateLabel: new Date(c.createdAt).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
            }),
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setChapters(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedCampaignId, listChapters]);

  return (
    <ChaptersListScreen
      chapters={chapters}
      onChapterPress={(chapter) => {
        router.push({
          pathname: '/master/chapter-detail',
          params: { chapterId: chapter.id, campaignId: resolvedCampaignId },
        });
      }}
      onNewChapter={() => {
        router.push(`/master/new-chapter?campaignId=${resolvedCampaignId}`);
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default ChaptersListRoute;
