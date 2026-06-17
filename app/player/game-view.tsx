import { useLocalSearchParams } from 'expo-router';

import {
  GameViewScreen,
  mapMockPlayerToPartyPlayer,
  MOCK_PARTY_PLAYER,
} from '@/screens/player/game-view';
import { MOCK_PLAYERS } from '@/screens/player/character-selection';

const GameViewRoute = () => {
  const { playerId } = useLocalSearchParams<{ playerId?: string }>();

  const selectedPlayer =
    typeof playerId === 'string'
      ? MOCK_PLAYERS.find((player) => player.id === playerId)
      : undefined;

  const partyPlayer = selectedPlayer
    ? mapMockPlayerToPartyPlayer(selectedPlayer)
    : MOCK_PARTY_PLAYER;

  return <GameViewScreen partyPlayer={partyPlayer} />;
};

export default GameViewRoute;
