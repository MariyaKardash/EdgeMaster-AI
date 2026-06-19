import { useLocalSearchParams } from 'expo-router';

import { useCampaign } from '@/contexts/campaign-context';
import { useChapterGameLog } from '@/hooks/useChapterGameLog';
import {
  GameViewScreen,
  mapMockPlayerToPartyPlayer,
  MOCK_PARTY_PLAYER,
} from '@/screens/player/game-view';
import { MOCK_PLAYERS } from '@/screens/player/character-selection';

const GameViewRoute = () => {
  const { playerId } = useLocalSearchParams<{ playerId?: string }>();
  const { activeChapter } = useCampaign();
  const gameLog = useChapterGameLog(activeChapter?.id);

  const selectedPlayer =
    typeof playerId === 'string'
      ? MOCK_PLAYERS.find((player) => player.id === playerId)
      : undefined;

  const partyPlayer = selectedPlayer
    ? mapMockPlayerToPartyPlayer(selectedPlayer)
    : MOCK_PARTY_PLAYER;

  return (
    <GameViewScreen
      partyPlayer={partyPlayer}
      chapterTitle={activeChapter?.title}
      chapterDescription={activeChapter?.description}
      gameLog={gameLog}
    />
  );
};

export default GameViewRoute;
