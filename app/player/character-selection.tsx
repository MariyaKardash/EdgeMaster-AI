import { useRouter } from 'expo-router';

import { CharacterSelectionScreen } from '@/screens/player/character-selection';

const CharacterSelectionRoute = () => {
  const router = useRouter();

  return <CharacterSelectionScreen onBack={() => router.back()} />;
};

export default CharacterSelectionRoute;
