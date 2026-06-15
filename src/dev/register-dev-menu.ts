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
  ]);
}
