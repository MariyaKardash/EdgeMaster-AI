import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import {
  campaignSchema,
  chapterSchema,
  createEntity,
  dbKeys,
  dbPrefixEnd,
  generateSessionCode,
  sessionSchema,
  touchEntity,
  type Campaign,
  type Chapter,
  type Session,
} from '@/database';
import { useCampaign } from '@/contexts/campaign-context';
import { defaultAlias } from '@/lib/holepunch/defaultAlias';
import { sessionTopicHex } from '@/lib/holepunch/sessionTopicHex';
import { CampaignSelectionScreen } from '@/screens/master/campaign-selection';
import type { CampaignSessionInfo } from '@/screens/master/campaign-selection';

const formatLastPlayed = (isoDate: string) => {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(deltaMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

const CampaignSelectionRoute = () => {
  const router = useRouter();
  const {
    ready,
    campaignsLoading,
    error,
    campaigns,
    activeSession,
    worklet,
    setError,
    setActiveCampaign,
    setActiveChapter,
    setActiveSession,
    setConnectionState,
    setCampaigns,
    openCampaign,
    startMasterSession,
    runWithoutCampaignRefresh,
  } = useCampaign();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const campaignCards: CampaignSessionInfo[] = campaigns.map((campaign, index) => {
    const isActiveCampaign = activeSession?.campaignId === campaign.id;

    return {
      campaignId: campaign.id,
      name: campaign.name,
      sessionNumber: index + 1,
      lastPlayed: formatLastPlayed(campaign.updatedAt),
      sessionCode: isActiveCampaign ? activeSession.sessionCode : undefined,
    };
  });

  const handleStartNew = async () => {
    if (!ready) {
      return;
    }

    await runWithoutCampaignRefresh(async () => {
      // --- Prepare UI for a new campaign ---
      setIsSubmitting(true);
      setError(null);

      const campaignName = `Campaign ${campaigns.length + 1}`;

      // --- 1. Create campaign ---
      let campaign: Campaign;
      try {
        campaign = createEntity<Campaign>({
          name: campaignName.trim(),
          activeChapterId: null,
        });

        // Pin this campaign so background refresh keeps its DB open.
        setActiveCampaign(campaign);

        // Open a dedicated P2P database for this campaign.
        await worklet.openCampaign(campaign.id);
        // Save the new campaign record.
        await worklet.put(dbKeys.campaign(campaign.id), campaign);

        // Read which campaigns already exist on this device.
        const campaignIds = (await worklet.get<string[]>(dbKeys.metaCampaignList())) ?? [];

        if (!campaignIds.includes(campaign.id)) {
          // Register the new campaign in the local campaign list.
          await worklet.put(dbKeys.metaCampaignList(), [campaign.id, ...campaignIds]);
        }
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert(
          'Unable to start campaign',
          error instanceof Error ? error.message : 'Something went wrong.',
        );
        return;
      }

      // --- 2. Create first chapter ---
      let chapter: Chapter;
      try {
        // Ensure the new campaign database is still open before writing chapters.
        await worklet.openCampaign(campaign.id);

        chapter = createEntity<Chapter>({
          campaignId: campaign.id,
          title: 'Chapter 1',
          description: 'The journey begins.',
          order: 0,
          status: 'draft',
          generationSource: { type: 'manual' },
        });

        // Save the first chapter record.
        await worklet.put(dbKeys.chapter(chapter.id), chapter);
        // Index the chapter under this campaign so it can be listed by order.
        await worklet.put(
          `${dbKeys.indexChaptersByCampaign(campaign.id)}${chapter.order}`,
          chapter.id,
        );
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert(
          'Unable to start campaign',
          error instanceof Error ? error.message : 'Something went wrong.',
        );
        return;
      }

      // --- 3. Activate chapter ---
      let activeCampaign: Campaign;
      try {
        // Re-open the campaign database before reading its records.
        await worklet.openCampaign(campaign.id);

        // Load the campaign we just created.
        const campaignValue = await worklet.get(dbKeys.campaign(campaign.id));

        if (!campaignValue) {
          throw new Error('Campaign not found.');
        }

        const storedCampaign = campaignSchema.parse(campaignValue);
        const chapterIndexPrefix = dbKeys.indexChaptersByCampaign(campaign.id);
        // List every chapter ID belonging to this campaign.
        const chapterEntries = await worklet.list<string>(
          chapterIndexPrefix,
          dbPrefixEnd(chapterIndexPrefix),
        );

        for (const entry of chapterEntries) {
          // Load each chapter so we can update its status.
          const chapterValue = await worklet.get(dbKeys.chapter(entry.value));

          if (!chapterValue) {
            continue;
          }

          const existingChapter = chapterSchema.parse(chapterValue);

          let nextStatus = existingChapter.status;
          if (existingChapter.id === chapter.id) {
            nextStatus = 'active';
          } else if (existingChapter.status === 'active') {
            nextStatus = 'completed';
          }

          const updatedChapter = touchEntity({ ...existingChapter, status: nextStatus });
          // Save the chapter with its new status (active or completed).
          await worklet.put(dbKeys.chapter(updatedChapter.id), updatedChapter);

          if (existingChapter.id === chapter.id) {
            chapter = updatedChapter;
          }
        }

        activeCampaign = touchEntity({
          ...storedCampaign,
          activeChapterId: chapter.id,
        });
        // Save the campaign with the active chapter ID set.
        await worklet.put(dbKeys.campaign(activeCampaign.id), activeCampaign);

        setActiveCampaign(activeCampaign);
        setActiveChapter(chapter);

        // --- 4. Reload campaign list for the selection screen ---
        const preserveOpenCampaignId = activeCampaign.id;
        // Read every campaign ID stored on this device.
        const listedCampaignIds = (await worklet.get<string[]>(dbKeys.metaCampaignList())) ?? [];
        const nextCampaigns: Campaign[] = [];

        for (const campaignId of listedCampaignIds) {
          // Open each campaign database to read its record.
          await worklet.openCampaign(campaignId);
          const listedCampaignValue = await worklet.get(dbKeys.campaign(campaignId));

          if (!listedCampaignValue) {
            if (preserveOpenCampaignId !== campaignId) {
              // Close campaigns we opened only for reading.
              await worklet.closeCampaign();
            }
            continue;
          }

          nextCampaigns.push(campaignSchema.parse(listedCampaignValue));

          if (preserveOpenCampaignId !== campaignId) {
            // Close campaigns we opened only for reading.
            await worklet.closeCampaign();
          }
        }

        // Keep the campaign we are starting open in the worklet.
        await worklet.openCampaign(preserveOpenCampaignId);

        setCampaigns(nextCampaigns);
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert(
          'Unable to start campaign',
          error instanceof Error ? error.message : 'Something went wrong.',
        );
        return;
      }

      // --- 5. Start master session ---
      let session: Session;
      try {
        setError(null);
        setConnectionState('connecting');

        // Re-open the campaign database before creating a session.
        await worklet.openCampaign(activeCampaign.id);

        // --- 5a. End any previous active session for this campaign ---
        // List all sessions stored on this device.
        const sessionEntries = await worklet.list<Session>(
          dbKeys.session(''),
          dbPrefixEnd('@session/'),
        );

        for (const entry of sessionEntries) {
          const existingSession = sessionSchema.parse(entry.value);

          if (existingSession.campaignId !== activeCampaign.id) {
            continue;
          }

          if (existingSession.status !== 'active') {
            continue;
          }

          // Load the still-active session so we can close it.
          const sessionValue = await worklet.get<Session>(dbKeys.session(existingSession.id));

          if (!sessionValue) {
            continue;
          }

          const endedSession = touchEntity({
            ...sessionSchema.parse(sessionValue),
            status: 'ended' as const,
          });
          // Mark the previous session as ended before starting a new one.
          await worklet.put(dbKeys.session(endedSession.id), endedSession);
        }

        // --- 5b. Create and save the new session ---
        const sessionCode = generateSessionCode();
        session = createEntity<Session>({
          campaignId: activeCampaign.id,
          chapterId: chapter.id,
          sessionCode,
          topicHex: sessionTopicHex(sessionCode),
          status: 'active',
        });

        // Save the new session record.
        await worklet.put(dbKeys.session(session.id), session);
        // Map the join code to this session so players can look it up.
        await worklet.put(dbKeys.indexSessionByCode(sessionCode), session.id);

        // --- 5c. Host the P2P swarm for player join codes ---
        // Start hosting the P2P swarm so players can join with the session code.
        await worklet.startSwarm({
          role: 'host',
          alias: defaultAlias(),
          topicHex: session.topicHex,
          sessionCode: session.sessionCode,
          sessionId: session.id,
        });
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert(
          'Unable to start campaign',
          error instanceof Error ? error.message : 'Something went wrong.',
        );
        return;
      }

      // --- 6. Open the session screen ---
      setActiveSession(session);
      setIsSubmitting(false);
      router.push('/master/session');
    });
  };

  const handleContinue = async (item: CampaignSessionInfo) => {
    setIsSubmitting(true);

    let chapter;
    try {
      const result = await openCampaign(item.campaignId);
      chapter = result.chapter;
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Unable to continue campaign',
        error instanceof Error ? error.message : 'Something went wrong.',
      );
      return;
    }

    if (!chapter) {
      setIsSubmitting(false);
      Alert.alert('Unable to continue', 'This campaign has no active chapter yet.');
      return;
    }

    try {
      await startMasterSession(item.campaignId, chapter.id);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Unable to continue campaign',
        error instanceof Error ? error.message : 'Something went wrong.',
      );
      return;
    }

    setIsSubmitting(false);
    router.push('/master/session');
  };

  return (
    <CampaignSelectionScreen
      campaigns={campaignCards}
      isLoading={!ready || isSubmitting}
      campaignsLoading={campaignsLoading}
      error={error}
      onBack={() => router.back()}
      onStartNew={() => void handleStartNew()}
      onContinue={(item) => void handleContinue(item)}
    />
  );
};

export default CampaignSelectionRoute;
