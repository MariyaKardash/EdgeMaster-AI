import 'react-native-gesture-handler';

import '@/theme/unistyles';

import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { createElement } from 'react';

// Preload before QVAC's dynamic imports (avoids Metro "unknown module" race on startup).
import 'expo-device';
import 'expo-file-system';
import 'react-native-bare-kit';

// Must be exported or Fast Refresh won't update the context
export const App = () => {
  const ctx = require.context('./app');
  return createElement(ExpoRoot, { context: ctx });
};

registerRootComponent(App);
