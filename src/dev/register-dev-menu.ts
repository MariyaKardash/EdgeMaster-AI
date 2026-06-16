import { registerDevMenuItems } from 'expo-dev-menu';
import { router } from 'expo-router';

export function registerAppDevMenuItems() {
  if (!__DEV__) return;

  void registerDevMenuItems([
    {
      name: 'Open LLM Chat',
      shouldCollapse: true,
      callback: () => {
        router.push('/dev/chat');
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
