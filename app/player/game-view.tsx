import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  GameViewScreen,
  mapMockPlayerToPartyPlayer,
  MOCK_PARTY_PLAYER,
} from '@/screens/player/game-view';
import { MOCK_PLAYERS } from '@/screens/player/character-selection';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { usePlayerGameView } from '@/hooks/usePlayerGameView';

const GameViewRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const { playerId } = useLocalSearchParams<{ playerId?: string }>();
  const isChatEnabled = campaignId != null;

  const { hasActiveChapter, chapterTitle, chapterDescription, logEntries, isLoading } =
    usePlayerGameView();

  const selectedPlayer =
    typeof playerId === 'string'
      ? MOCK_PLAYERS.find((player) => player.id === playerId)
      : undefined;

  const partyPlayer = selectedPlayer
    ? mapMockPlayerToPartyPlayer(selectedPlayer)
    : MOCK_PARTY_PLAYER;

  return (
    <GameViewScreen
      hasActiveChapter={hasActiveChapter}
      chapterTitle={chapterTitle}
      chapterDescription={chapterDescription}
      logEntries={logEntries}
      isLoadingEvents={isLoading}
      partyPlayer={partyPlayer}
      isChatEnabled={isChatEnabled}
      onChatPress={() => router.push('/player/chat')}
    />
  );
};

export default GameViewRoute;
