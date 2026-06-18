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
import { useCampaignId, useCampaignSessionCode } from '@/hooks/useCampaignSessionId';
import { defaultAlias } from '@/lib/holepunch/defaultAlias';
import { campaignTopicHex } from '@/lib/holepunch/sessionTopicHex';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { SessionDashboardScreen } from '@/screens/master/session-dashboard';
import { logDev } from '@/lib/logger';

const DEFAULT_PLAYER_CLASS = 'Adventurer';

function isPlayerSessionDbKey(key: string, sessionId: string) {
  return key.startsWith('@player/') || key.startsWith(dbKeys.indexPlayersBySession(sessionId));
}

function mapPlayerToConnected(player: Player): ConnectedPlayer {
  return {
    id: player.id,
    name: player.displayName,
    class: DEFAULT_PLAYER_CLASS,
    imageUri: '',
    connected: true,
  };
}

function mergeConnectedPlayer(players: ConnectedPlayer[], player: Player) {
  const mapped = mapPlayerToConnected(player);
  const existingIndex = players.findIndex((item) => item.id === mapped.id);

  if (existingIndex === -1) {
    return [...players, mapped];
  }

  return players.map((item, index) => (index === existingIndex ? mapped : item));
}

function playerIdFromDbKey(key: string) {
  return key.startsWith('@player/') ? key.slice('@player/'.length) : undefined;
}

const SessionDashboardRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const displaySessionCode = useCampaignSessionCode();
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
  const [sessionCode, setSessionCode] = useState<string>();
  const [connectedPlayers, setConnectedPlayers] = useState<ConnectedPlayer[]>([]);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const autoStartAttemptedRef = useRef(false);

  const isHostingCurrentCampaign =
    connectionState === 'connected' &&
    activeSession?.campaignId === campaignId &&
    activeSession?.status === 'active';

  const isSessionActive = isHostingCurrentCampaign;
  const isSessionConnecting = connectionState === 'connecting' || isStartingSession;

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
      logDev('startSwarm', { role: 'host', alias: defaultAlias(), session });
      await worklet.startSwarm({
        role: 'host',
        alias: defaultAlias(),
        sessionCode: session.sessionCode,
      });

      setActiveSession(session);
      setSessionCode(session.sessionCode);
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
          setSessionCode(existingSession.sessionCode);
          setActiveSession(existingSession);
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
  }, [campaignId, ready, setActiveCampaign, setActiveChapter, setActiveSession, setError, worklet]);

  const hostedSessionId =
    activeSession && activeSession.campaignId === campaignId && activeSession.status === 'active'
      ? activeSession.id
      : undefined;

  useEffect(() => {
    if (!hostedSessionId || connectionState !== 'connected') {
      return;
    }

    const sessionId = hostedSessionId;
    let cancelled = false;

    const refreshPlayers = () => {
      void fetchPlayers(sessionId).then((players) => {
        if (!cancelled) {
          setConnectedPlayers(players);
        }
      });
    };

    refreshPlayers();

    const unsubscribe = worklet.onEvent((event) => {
      if (event.type === 'peer-open') {
        refreshPlayers();
        return;
      }

      if (event.type === 'db-put') {
        if (!isPlayerSessionDbKey(event.key, sessionId)) {
          return;
        }

        if (event.key.startsWith('@player/') && event.value && typeof event.value === 'object') {
          const parsed = playerSchema.safeParse(event.value);

          if (parsed.success && parsed.data.sessionId === sessionId) {
            setConnectedPlayers((current) => mergeConnectedPlayer(current, parsed.data));
            return;
          }
        }

        refreshPlayers();
        return;
      }

      if (event.type === 'db-del' && isPlayerSessionDbKey(event.key, sessionId)) {
        const playerId = playerIdFromDbKey(event.key);

        if (playerId) {
          setConnectedPlayers((current) => current.filter((player) => player.id !== playerId));
          return;
        }

        refreshPlayers();
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [connectedPeers, connectionState, fetchPlayers, hostedSessionId, worklet]);

  const displayedConnectedPlayers =
    connectionState === 'connected' && hostedSessionId ? connectedPlayers : [];

  const handleStartSession = async () => {
    if (!ready || !campaignId || isStartingSession || isHostingCurrentCampaign) {
      return;
    }

    if (connectionState === 'connecting') {
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

        logDev({ currentSession });

        if (currentSession) {
          logDev('[hostSession]');
          await worklet.openCampaign(campaignId);

          const expectedSessionCode = sessionIdFromCampaignId(campaignId);
          const expectedTopicHex = campaignTopicHex(campaignId);
          let session = currentSession;

          if (
            session.sessionCode !== expectedSessionCode ||
            session.topicHex !== expectedTopicHex
          ) {
            const previousSessionCode = session.sessionCode;
            const previousTopicHex = session.topicHex;

            session = touchEntity({
              ...session,
              sessionCode: expectedSessionCode,
              topicHex: expectedTopicHex,
            });

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

          await hostSession(session);
          return;
        }

        logDev('[openCampaign]');
        // --- 1. Open campaign database ---
        await worklet.openCampaign(campaignId);

        const campaignValue = await worklet.get(dbKeys.campaign(campaignId));

        if (!campaignValue) {
          throw new Error('Campaign not found.');
        }

        const campaign = campaignSchema.parse(normalizeStoredCampaign(campaignValue));
        setActiveCampaign(campaign);

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

  const resolvedSessionCode = sessionCode ?? displaySessionCode;

  useEffect(() => {
    autoStartAttemptedRef.current = false;
  }, [campaignId]);

  useEffect(() => {
    if (!ready || !campaignId || autoStartAttemptedRef.current || isStartingSession) {
      return;
    }

    if (isHostingCurrentCampaign || connectionState === 'connecting') {
      return;
    }

    autoStartAttemptedRef.current = true;
    const timeoutId = setTimeout(() => {
      void handleStartSession();
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-start runs once per campaign when prerequisites are met
  }, [campaignId, connectionState, isHostingCurrentCampaign, isStartingSession, ready]);

  return (
    <SessionDashboardScreen
      sessionId={isHostingCurrentCampaign || isSessionConnecting ? resolvedSessionCode : undefined}
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
