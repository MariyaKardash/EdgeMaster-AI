import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: withAlphaHex('background', 0.9),
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('outlineVariant', 0.15),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  brandTitle: {
    color: theme.colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  dismissPressable: {
    flexGrow: 1,
    gap: theme.spacing.lg,
  },
  playersList: {
    gap: theme.spacing.lg,
  },
}));
