import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  background: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.15),
  },
  handleIndicator: {
    width: 40,
    backgroundColor: withAlphaHex('onSurfaceVariant', 0.35),
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.md,
  },
}));
