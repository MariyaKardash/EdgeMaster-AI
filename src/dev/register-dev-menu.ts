import { registerDevMenuItems } from 'expo-dev-menu';
import { router } from 'expo-router';

export function registerAppDevMenuItems() {
  if (!__DEV__) return;

  void registerDevMenuItems([
    {
      name: 'Player Game View (Dev)',
      shouldCollapse: true,
      callback: () => {
        router.push({
          pathname: '/player/game-view',
          params: { playerId: 'valerius' },
        });
      },
    },
    {
      name: 'New Chapter (Dev)',
      shouldCollapse: true,
      callback: () => {
        router.push('/dev/new-chapter');
      },
    },
  ]);
}
