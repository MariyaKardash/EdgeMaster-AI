import type { PartyPlayer } from '@/components/molecules/party-player-card';

let playerInput: PartyPlayer | null = null;
let updatedPlayer: PartyPlayer | null = null;

export const setEquipHeroPlayerInput = (player: PartyPlayer) => {
  playerInput = player;
};

export const consumeEquipHeroPlayerInput = () => {
  const player = playerInput;
  playerInput = null;
  return player;
};

export const setEquipHeroPlayerUpdate = (player: PartyPlayer) => {
  updatedPlayer = player;
};

export const consumeEquipHeroPlayerUpdate = () => {
  const player = updatedPlayer;
  updatedPlayer = null;
  return player;
};
