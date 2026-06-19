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
    paddingHorizontal: theme.spacing.containerMargin,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('outlineVariant', 0.15),
    gap: theme.spacing.sm,
  },
  chapterTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  chapterTitle: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  chatButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  chatButtonDisabled: {
    opacity: 0.4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
}));
