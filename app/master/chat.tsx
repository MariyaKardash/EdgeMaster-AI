import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { SessionDashboardBottomNav } from '@/components';
import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter } from '@/database';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { buildCampaignDocuments } from '@/lib/campaign-documents';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { LLMChatScreen } from '@/screens/llm-chat';
import type { CampaignDoc } from '@/types/campaign.types';

const MasterChatRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const { activeCampaign, openCampaign, listChapters } = useCampaign();

  const [campaignName, setCampaignName] = useState<string | null>(activeCampaign?.name ?? null);
  const [seedDocuments, setSeedDocuments] = useState<CampaignDoc[] | null>(null);
  const [isResolving, setIsResolving] = useState(true);

  const loadCampaignData = useCallback(
    async (resolvedCampaignId: string) => {
      let campaign = activeCampaign?.id === resolvedCampaignId ? activeCampaign : null;

      if (!campaign) {
        const opened = await openCampaign(resolvedCampaignId);
        campaign = opened.campaign;
      }

      const chapters: Chapter[] = await listChapters(resolvedCampaignId);

      setCampaignName(campaign.name);
      setSeedDocuments(buildCampaignDocuments(chapters));
    },
    [activeCampaign, listChapters, openCampaign],
  );

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    const resolvedCampaignId = campaignId;
    let cancelled = false;

    async function resolve() {
      setIsResolving(true);
      try {
        await loadCampaignData(resolvedCampaignId);
      } catch {
        if (!cancelled) {
          setCampaignName(null);
          setSeedDocuments([]);
        }
      } finally {
        if (!cancelled) {
          setIsResolving(false);
        }
      }
    }

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [campaignId, loadCampaignData]);

  if (!campaignId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isResolving || !campaignName || seedDocuments === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LLMChatScreen
      campaignId={campaignId}
      campaignName={campaignName}
      seedDocuments={seedDocuments}
      footer={
        <SessionDashboardBottomNav
          activeTab="chat"
          onTabPress={(tab) => {
            navigateSessionDashboardTab(router, tab, campaignId);
          }}
        />
      }
    />
  );
};

export default MasterChatRoute;
