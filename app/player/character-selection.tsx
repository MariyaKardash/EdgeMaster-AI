import { useRouter } from 'expo-router';

import { CharacterSelectionScreen, type MockPlayer } from '@/screens/player/character-selection';

const CharacterSelectionRoute = () => {
  const router = useRouter();

  const handleSelectCharacter = (player: MockPlayer) => {
    router.replace({
      pathname: '/player/game-view',
      params: { playerId: player.id },
    });
  };

  return (
    <CharacterSelectionScreen
      onBack={() => router.back()}
      onSelectCharacter={handleSelectCharacter}
    />
  );
};

export default CharacterSelectionRoute;
