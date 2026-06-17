import type { PartyPlayer } from '@/components/molecules/party-player-card';
import type { MockPlayer } from '@/screens/player/character-selection';
import { MOCK_PARTY_PLAYER } from './game-view.constants';

export const mapMockPlayerToPartyPlayer = (
  selected: MockPlayer,
  base: PartyPlayer = MOCK_PARTY_PLAYER,
): PartyPlayer => ({
  ...base,
  id: selected.id,
  name: selected.name,
  race: selected.class,
  imageUri: selected.imageUri,
  stats: {
    str: selected.stats.str,
    dex: selected.stats.dex,
    int: selected.stats.int,
  },
});
