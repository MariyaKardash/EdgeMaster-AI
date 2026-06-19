import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useCampaign } from '@/contexts/campaign-context';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { useChapterGameLog } from '@/hooks/useChapterGameLog';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { LiveControlScreen } from '@/screens/master/live-control';

const LiveControlRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const { activeChapter, createGameEvent } = useCampaign();
  const gameLog = useChapterGameLog(activeChapter?.id);

  const handleExecuteEvent = useCallback(
    async (message: string) => {
      if (!activeChapter) {
        return;
      }

      try {
        await createGameEvent({
          chapterId: activeChapter.id,
          type: 'event',
          title: message.length > 80 ? `${message.slice(0, 77)}...` : message,
          body: message,
        });
      } catch (error) {
        Alert.alert(
          'Unable to save event',
          error instanceof Error ? error.message : 'Something went wrong.',
        );
        throw error;
      }
    },
    [activeChapter, createGameEvent],
  );

  return (
    <LiveControlScreen
      {...(activeChapter
        ? {
            chapterTitle: activeChapter.title,
            chapterSubtitle: activeChapter.description,
          }
        : {})}
      logEntries={gameLog}
      onExecuteEvent={activeChapter ? (message) => handleExecuteEvent(message) : undefined}
      onSummarizeAndEndChapter={() => {
        //TODO: add redirect to summary screen
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default LiveControlRoute;
