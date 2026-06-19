import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/components';
import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter } from '@/database';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { buildCampaignDocuments } from '@/lib/campaign-documents';
import { LLMChatScreen } from '@/screens/llm-chat';
import type { CampaignDoc } from '@/types/campaign.types';

const PlayerChatRoute = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const campaignId = useCampaignId();
  const { activeCampaign, openCampaign, listChapters } = useCampaign();

  const [campaignName, setCampaignName] = useState<string | null>(activeCampaign?.name ?? null);
  const [seedDocuments, setSeedDocuments] = useState<CampaignDoc[] | null>(null);
  const [isResolving, setIsResolving] = useState(false);

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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.containerMargin,
          gap: theme.spacing.md,
        }}
      >
        <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
          Join a session to use campaign chat.
        </Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={{ color: theme.colors.primary }}>Go back</Text>
        </Pressable>
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
    <View style={{ flex: 1 }}>
      <LLMChatScreen
        campaignId={campaignId}
        campaignName={campaignName}
        seedDocuments={seedDocuments}
      />
      <Pressable
        style={{
          position: 'absolute',
          top: insets.top + theme.spacing.sm,
          right: theme.spacing.containerMargin,
          zIndex: 10,
          padding: theme.spacing.sm,
        }}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
      >
        <Icon name="arrow-back" size={24} color="primary" />
      </Pressable>
    </View>
  );
};

export default PlayerChatRoute;
