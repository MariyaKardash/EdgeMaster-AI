import 'react-native-gesture-handler';

import '@/theme/unistyles';

import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { createElement } from 'react';

// Must be exported or Fast Refresh won't update the context
export const App = () => {
  const ctx = require.context('./app');
  return createElement(ExpoRoot, { context: ctx });
};

registerRootComponent(App);
