import { StyleSheet } from 'react-native-unistyles';

import { colors } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import { textStyles } from './typography';

const darkTheme = {
  colors,
  spacing,
  radius,
  textStyles,
} as const;

type AppThemes = {
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- required for Unistyles theme typing
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    dark: darkTheme,
  },
  settings: {
    initialTheme: 'dark',
  },
});

export { darkTheme };
