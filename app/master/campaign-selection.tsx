import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useCampaign } from '@/contexts/campaign-context';
import { CampaignSelectionScreen } from '@/screens/master/campaign-selection';
import type { CampaignSessionInfo } from '@/screens/master/campaign-selection';

const formatLastPlayed = (isoDate: string) => {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(deltaMs / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return 'Today';
  }

  if (days === 1) {
    return '1 day ago';
  }

  return `${days} days ago`;
};

const CampaignSelectionRoute = () => {
  const router = useRouter();
  const { ready, campaigns, activeSession, createCampaign, openCampaign, startMasterSession } =
    useCampaign();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const campaignCards = useMemo<CampaignSessionInfo[]>(
    () =>
      campaigns.map((campaign, index) => ({
        campaignId: campaign.id,
        name: campaign.name,
        sessionNumber: index + 1,
        lastPlayed: formatLastPlayed(campaign.updatedAt),
        sessionCode:
          activeSession?.campaignId === campaign.id ? activeSession.sessionCode : undefined,
      })),
    [activeSession, campaigns],
  );

  const handleStartNew = async () => {
    try {
      setIsSubmitting(true);
      const campaign = await createCampaign(`Campaign ${campaigns.length + 1}`);

      if (!campaign.activeChapterId) {
        return;
      }

      await startMasterSession(campaign.id, campaign.activeChapterId);
      router.push('/master/session');
    } catch (startError) {
      Alert.alert(
        'Unable to start campaign',
        startError instanceof Error ? startError.message : 'Something went wrong.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async (item: CampaignSessionInfo) => {
    try {
      setIsSubmitting(true);
      const { chapter } = await openCampaign(item.campaignId);

      if (!chapter) {
        Alert.alert('Unable to continue', 'This campaign has no active chapter yet.');
        return;
      }

      await startMasterSession(item.campaignId, chapter.id);
      router.push('/master/session');
    } catch (continueError) {
      Alert.alert(
        'Unable to continue campaign',
        continueError instanceof Error ? continueError.message : 'Something went wrong.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CampaignSelectionScreen
      campaigns={campaignCards}
      isLoading={!ready || isSubmitting}
      onBack={() => router.back()}
      onStartNew={() => {
        void handleStartNew();
      }}
      onContinue={(item) => {
        void handleContinue(item);
      }}
    />
  );
};

export default CampaignSelectionRoute;
