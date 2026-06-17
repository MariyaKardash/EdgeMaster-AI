import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import type { ConnectedPlayer } from '@/components/molecules/connected-player-avatar';
import { useCampaign } from '@/contexts/campaign-context';
import {
  campaignSchema,
  chapterSchema,
  createEntity,
  dbKeys,
  dbPrefixEnd,
  normalizeStoredCampaign,
  sessionIdFromCampaignId,
  playerSchema,
  sessionSchema,
  touchEntity,
  type Chapter,
  type Player,
  type Session,
} from '@/database';
import { useCampaignId, useCampaignTopicHex } from '@/hooks/useCampaignSessionId';
import { defaultAlias } from '@/lib/holepunch/defaultAlias';
import { campaignTopicHex } from '@/lib/holepunch/sessionTopicHex';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { SessionDashboardScreen } from '@/screens/master/session-dashboard';

const DEFAULT_PLAYER_CLASS = 'Adventurer';

function mapPlayerToConnected(player: Player): ConnectedPlayer {
  return {
    id: player.id,
    name: player.displayName,
    class: DEFAULT_PLAYER_CLASS,
    imageUri: '',
    connected: true,
  };
}

const SessionDashboardRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const displayTopicHex = useCampaignTopicHex();
  const {
    ready,
    activeSession,
    activeCampaign,
    activeChapter,
    connectedPeers,
    connectionState,
    worklet,
    setError,
    setActiveCampaign,
    setActiveChapter,
    setActiveSession,
    setConnectionState,
    runWithoutCampaignRefresh,
  } = useCampaign();
  const [topicHex, setTopicHex] = useState<string>();
  const [connectedPlayers, setConnectedPlayers] = useState<ConnectedPlayer[]>([]);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const autoStartAttemptedRef = useRef(false);

  const isSessionActive = connectionState === 'connected';
  const isSessionConnecting = connectionState === 'connecting';

  const fetchPlayers = useCallback(
    async (sessionId: string) => {
      const entries = await worklet.list<string>(
        dbKeys.indexPlayersBySession(sessionId),
        dbPrefixEnd(dbKeys.indexPlayersBySession(sessionId)),
      );
      const players: Player[] = [];

      for (const entry of entries) {
        const value = await worklet.get<Player>(dbKeys.player(entry.value));

        if (value) {
          players.push(playerSchema.parse(value));
        }
      }

      return players.map(mapPlayerToConnected);
    },
    [worklet],
  );

  const loadPlayers = useCallback(
    async (sessionId: string) => {
      setConnectedPlayers(await fetchPlayers(sessionId));
    },
    [fetchPlayers],
  );

  const hostSession = useCallback(
    async (session: Session) => {
      // Start hosting the P2P swarm so players can join with the topic hex.
      await worklet.startSwarm({
        role: 'host',
        alias: defaultAlias(),
      });

      setActiveSession(session);
      setTopicHex(session.topicHex);
      await loadPlayers(session.id);
    },
    [loadPlayers, setActiveSession, worklet],
  );

  useEffect(() => {
    if (!ready || !campaignId) {
      return;
    }

    let cancelled = false;

    const bootstrap = async () => {
      try {
        // Open the campaign database so chapter and session records can be read.
        await worklet.openCampaign(campaignId);

        const campaignValue = await worklet.get(dbKeys.campaign(campaignId));

        if (!campaignValue) {
          return;
        }

        const campaign = campaignSchema.parse(normalizeStoredCampaign(campaignValue));
        setActiveCampaign(campaign);

        if (campaign.activeChapterId) {
          const chapterValue = await worklet.get<Chapter>(dbKeys.chapter(campaign.activeChapterId));

          if (chapterValue) {
            setActiveChapter(chapterSchema.parse(chapterValue));
          }
        }

        const sessionEntries = await worklet.list<Session>(
          dbKeys.session(''),
          dbPrefixEnd('@session/'),
        );

        const existingSession = sessionEntries
          .map((entry) => sessionSchema.parse(entry.value))
          .find((item) => item.campaignId === campaignId && item.status === 'active');

        if (existingSession && !cancelled) {
          setTopicHex(existingSession.topicHex);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : 'Failed to load campaign.');
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [campaignId, ready, setActiveCampaign, setActiveChapter, setError, worklet]);

  useEffect(() => {
    if (!isSessionActive || !activeSession?.id) {
      return;
    }

    let cancelled = false;

    void fetchPlayers(activeSession.id).then((players) => {
      if (!cancelled) {
        setConnectedPlayers(players);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeSession?.id, connectedPeers, fetchPlayers, isSessionActive]);

  const displayedConnectedPlayers = isSessionActive ? connectedPlayers : [];

  const handleStartSession = async () => {
    if (!ready || !campaignId || isStartingSession || isSessionActive || isSessionConnecting) {
      return;
    }

    setIsStartingSession(true);
    setError(null);
    setConnectionState('connecting');

    try {
      await runWithoutCampaignRefresh(async () => {
        const currentSession =
          activeSession?.campaignId === campaignId && activeSession.status === 'active'
            ? activeSession
            : null;

        if (currentSession) {
          await hostSession(currentSession);
          return;
        }

        // --- 1. Open campaign database ---
        await worklet.openCampaign(campaignId);

        const campaignValue = await worklet.get(dbKeys.campaign(campaignId));

        if (!campaignValue) {
          throw new Error('Campaign not found.');
        }

        const campaign = campaignSchema.parse(normalizeStoredCampaign(campaignValue));
        setActiveCampaign(campaign);

        // --- 2. Ensure active chapter ---
        let chapter: Chapter | null = null;

        if (campaign.activeChapterId) {
          const chapterValue = await worklet.get<Chapter>(dbKeys.chapter(campaign.activeChapterId));

          if (chapterValue) {
            chapter = chapterSchema.parse(chapterValue);
          }
        }

        if (!chapter) {
          chapter = createEntity<Chapter>({
            campaignId,
            title: 'Chapter 1',
            description: 'The journey begins.',
            order: 0,
            status: 'active',
            generationSource: { type: 'manual' },
          });

          // Save the first chapter record.
          await worklet.put(dbKeys.chapter(chapter.id), chapter);
          // Index the chapter under this campaign so it can be listed by order.
          await worklet.put(
            `${dbKeys.indexChaptersByCampaign(campaignId)}${chapter.order}`,
            chapter.id,
          );

          const campaignNext = touchEntity({
            ...campaign,
            activeChapterId: chapter.id,
          });

          // Mark this chapter as the active chapter for the campaign.
          await worklet.put(dbKeys.campaign(campaignNext.id), campaignNext);
          setActiveCampaign(campaignNext);
        }

        setActiveChapter(chapter);

        // --- 3. Reuse active session or create one ---
        const sessionEntries = await worklet.list<Session>(
          dbKeys.session(''),
          dbPrefixEnd('@session/'),
        );

        let session =
          sessionEntries
            .map((entry) => sessionSchema.parse(entry.value))
            .find((item) => item.campaignId === campaignId && item.status === 'active') ?? null;

        const expectedSessionCode = sessionIdFromCampaignId(campaignId);
        const expectedTopicHex = campaignTopicHex(campaignId);

        if (
          session &&
          (session.sessionCode !== expectedSessionCode || session.topicHex !== expectedTopicHex)
        ) {
          const previousSessionCode = session.sessionCode;
          const previousTopicHex = session.topicHex;

          session = touchEntity({
            ...session,
            sessionCode: expectedSessionCode,
            topicHex: expectedTopicHex,
          });

          // Align stored session metadata with the campaign-derived join code and topic.
          await worklet.put(dbKeys.session(session.id), session);

          if (previousSessionCode !== expectedSessionCode) {
            await worklet.del(dbKeys.indexSessionByCode(previousSessionCode));
          }

          if (previousTopicHex !== expectedTopicHex) {
            await worklet.del(dbKeys.indexSessionByTopicHex(previousTopicHex));
          }

          await worklet.put(dbKeys.indexSessionByCode(session.sessionCode), session.id);
          await worklet.put(dbKeys.indexSessionByTopicHex(session.topicHex), session.id);
        }

        if (!session) {
          const nextSessionCode = sessionIdFromCampaignId(campaignId);

          session = createEntity<Session>({
            campaignId,
            chapterId: chapter.id,
            sessionCode: nextSessionCode,
            topicHex: campaignTopicHex(campaignId),
            status: 'active',
          });

          // Save the new session record.
          await worklet.put(dbKeys.session(session.id), session);
          // Map the topic hex to this session so players can look it up.
          await worklet.put(dbKeys.indexSessionByCode(session.sessionCode), session.id);
          await worklet.put(dbKeys.indexSessionByTopicHex(session.topicHex), session.id);
        }

        // --- 4. Host hyperswarm session for player join codes ---
        await hostSession(session);
      });
    } catch (error) {
      autoStartAttemptedRef.current = false;
      setConnectionState('error');
      Alert.alert(
        'Unable to start session',
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsStartingSession(false);
    }
  };

  const resolvedTopicHex = topicHex ?? displayTopicHex;

  useEffect(() => {
    autoStartAttemptedRef.current = false;
  }, [campaignId]);

  useEffect(() => {
    if (!ready || !campaignId || autoStartAttemptedRef.current || connectionState !== 'idle') {
      return;
    }

    autoStartAttemptedRef.current = true;
    void handleStartSession();
  }, [ready, campaignId, connectionState]);

  return (
    <SessionDashboardScreen
      sessionId={resolvedTopicHex}
      isSessionActive={isSessionActive}
      isSessionConnecting={isSessionConnecting}
      isStartingSession={isStartingSession}
      activeChapterTitle={activeChapter?.title}
      activeChapterDescription={activeChapter?.description}
      connectedPlayers={displayedConnectedPlayers}
      onStartSession={() => void handleStartSession()}
      campaignName={activeCampaign?.name}
      onOpenChapter={
        activeChapter
          ? () => {
              router.push({
                pathname: '/master/live-control',
                params: campaignId ? { campaignId } : undefined,
              });
            }
          : undefined
      }
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default SessionDashboardRoute;
