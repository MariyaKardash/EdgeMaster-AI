import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  CampaignRepository,
  createP2pWorkletClient,
  type Campaign,
  type Chapter,
  type Session,
} from '@/database';
import type { P2pWorkletClient, P2pWorkletEvent } from '@/database/p2p/types';
import { getP2pStoragePath } from '@/database/p2p/storage-path';
import { defaultAlias } from '@/lib/holepunch/defaultAlias';
import { sessionTopicHex } from '@/lib/holepunch/sessionTopicHex';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

type CampaignContextValue = {
  ready: boolean;
  error: string | null;
  connectionState: ConnectionState;
  connectedPeers: number;
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  activeChapter: Chapter | null;
  activeSession: Session | null;
  worklet: P2pWorkletClient;
  refreshCampaigns: () => Promise<void>;
  runWithoutCampaignRefresh: <T>(fn: () => Promise<T>) => Promise<T>;
  setError: (error: string | null) => void;
  setActiveCampaign: (campaign: Campaign | null) => void;
  setActiveChapter: (chapter: Chapter | null) => void;
  setActiveSession: (session: Session | null) => void;
  setConnectionState: (connectionState: ConnectionState) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  openCampaign: (campaignId: string) => Promise<{ campaign: Campaign; chapter: Chapter | null }>;
  startMasterSession: (campaignId: string, chapterId: string) => Promise<Session>;
  joinPlayerSession: (sessionCode: string, displayName?: string) => Promise<Session>;
  stopSession: () => Promise<void>;
};

const CampaignContext = createContext<CampaignContextValue | null>(null);

function createCampaignRuntime() {
  const worklet = createP2pWorkletClient();

  return {
    worklet,
    repository: new CampaignRepository(worklet),
  };
}

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [runtime] = useState(createCampaignRuntime);
  const { worklet, repository } = runtime;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [connectedPeers, setConnectedPeers] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const activeCampaignIdRef = useRef<string | null>(null);
  const refreshInFlightRef = useRef<Promise<void> | null>(null);
  const suspendRefreshRef = useRef(false);

  const setActiveCampaignState = useCallback((campaign: Campaign | null) => {
    activeCampaignIdRef.current = campaign?.id ?? null;
    setActiveCampaign(campaign);
  }, []);

  const refreshCampaignsInternal = useCallback(async () => {
    if (refreshInFlightRef.current) {
      await refreshInFlightRef.current;
      return;
    }

    const refresh = (async () => {
      const summaries = await repository.listLocalCampaigns(activeCampaignIdRef.current);
      setCampaigns(summaries.map((summary) => summary.campaign));
    })();

    refreshInFlightRef.current = refresh;

    try {
      await refresh;
    } finally {
      if (refreshInFlightRef.current === refresh) {
        refreshInFlightRef.current = null;
      }
    }
  }, [repository]);

  const refreshCampaigns = useCallback(async () => {
    await refreshCampaignsInternal();
  }, [refreshCampaignsInternal]);

  const runWithoutCampaignRefresh = useCallback(async <T,>(fn: () => Promise<T>) => {
    suspendRefreshRef.current = true;

    try {
      return await fn();
    } finally {
      suspendRefreshRef.current = false;
    }
  }, []);

  const refreshCampaignsRef = useRef(refreshCampaignsInternal);

  useEffect(() => {
    refreshCampaignsRef.current = refreshCampaignsInternal;
  }, [refreshCampaignsInternal]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        await worklet.init(getP2pStoragePath());

        if (cancelled) {
          return;
        }

        setReady(true);
        await refreshCampaignsRef.current();
      } catch (bootstrapError) {
        if (!cancelled) {
          setReady(false);
          setError(
            bootstrapError instanceof Error
              ? bootstrapError.message
              : 'Failed to initialize P2P storage.',
          );
        }
      }
    };

    const unsubscribe = worklet.onEvent((event: P2pWorkletEvent) => {
      if (event.type === 'metrics' || event.type === 'peer-open' || event.type === 'peer-closed') {
        setConnectedPeers(event.type === 'metrics' ? event.peers : event.connectionCount);
      }

      if (event.type === 'ready') {
        setConnectionState('connected');
      }

      if (event.type === 'stopped') {
        setConnectionState('idle');
        setConnectedPeers(0);
      }

      if (event.type === 'error') {
        setError(event.message);
        setConnectionState('error');
      }

      if ((event.type === 'db-put' || event.type === 'db-del') && !suspendRefreshRef.current) {
        void refreshCampaignsRef.current();
      }
    });

    void bootstrap();

    return () => {
      cancelled = true;
      setReady(false);
      unsubscribe();
      worklet.dispose();
    };
  }, [worklet]);

  const openCampaign = useCallback(
    async (campaignId: string) => {
      setError(null);
      await repository.openCampaign(campaignId);
      const campaign = await repository.getCampaign(campaignId);

      if (!campaign) {
        throw new Error('Campaign not found.');
      }

      const chapter = await repository.getActiveChapter(campaignId);
      setActiveCampaignState(campaign);
      setActiveChapter(chapter);

      return { campaign, chapter };
    },
    [repository, setActiveCampaignState],
  );

  const startMasterSession = useCallback(
    async (campaignId: string, chapterId: string) => {
      setError(null);
      setConnectionState('connecting');

      await repository.openCampaign(campaignId);
      const session = await repository.createSession(campaignId, chapterId);

      await worklet.startSwarm({
        role: 'host',
        alias: defaultAlias(),
        topicHex: session.topicHex,
        sessionCode: session.sessionCode,
        sessionId: session.id,
      });

      setActiveSession(session);
      return session;
    },
    [repository, worklet],
  );

  const joinPlayerSession = useCallback(
    async (sessionCode: string, displayName = defaultAlias()) => {
      setError(null);
      setConnectionState('connecting');

      await worklet.startSwarm({
        role: 'join',
        alias: displayName,
        topicHex: sessionTopicHex(sessionCode),
        sessionCode,
      });

      await worklet.waitForCampaignOpened();

      const session = await repository.getSessionByCode(sessionCode, { wait: true });

      if (!session) {
        throw new Error('Session not found. Check the code and try again.');
      }

      await repository.registerPlayer(session.id, displayName);

      const campaign = await repository.getCampaign(session.campaignId);
      const chapter = await repository.getActiveChapter(session.campaignId);

      setActiveSession(session);
      setActiveCampaignState(campaign);
      setActiveChapter(chapter);

      return session;
    },
    [repository, worklet, setActiveCampaignState],
  );

  const stopSession = useCallback(async () => {
    if (activeSession) {
      await repository.endSession(activeSession.id);
    }

    await worklet.stopSwarm();
    setConnectionState('idle');
    setConnectedPeers(0);
    setActiveSession(null);
  }, [activeSession, repository, worklet]);

  const value = useMemo(
    () => ({
      ready,
      error,
      connectionState,
      connectedPeers,
      campaigns,
      activeCampaign,
      activeChapter,
      activeSession,
      worklet,
      refreshCampaigns,
      runWithoutCampaignRefresh,
      setError,
      setActiveCampaign: setActiveCampaignState,
      setActiveChapter,
      setActiveSession,
      setConnectionState,
      setCampaigns,
      openCampaign,
      startMasterSession,
      joinPlayerSession,
      stopSession,
    }),
    [
      ready,
      error,
      connectionState,
      connectedPeers,
      campaigns,
      activeCampaign,
      activeChapter,
      activeSession,
      worklet,
      refreshCampaigns,
      runWithoutCampaignRefresh,
      setError,
      setActiveCampaignState,
      setActiveChapter,
      setActiveSession,
      setConnectionState,
      setCampaigns,
      openCampaign,
      startMasterSession,
      joinPlayerSession,
      stopSession,
    ],
  );

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export function useCampaign() {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error('useCampaign must be used within CampaignProvider.');
  }

  return context;
}
