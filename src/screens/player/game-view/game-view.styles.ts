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
    paddingHorizontal: theme.spacing.gutter,
    backgroundColor: theme.colors.background,
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
    letterSpacing: 0.5,
  },
  sensorsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.gutter,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  chapterTitle: {
    color: theme.colors.primary,
  },
  narrativeCard: {
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.1),
    backgroundColor: withAlphaHex('surfaceContainerLow', 0.4),
  },
  narrativeParagraph: {
    color: withAlphaHex('onSurface', 0.9),
    lineHeight: 32,
  },
  narrativeQuote: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
    borderLeftWidth: 2,
    borderLeftColor: withAlphaHex('primary', 0.4),
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    lineHeight: 32,
  },
  chapterImageWrapper: {
    width: '100%',
    height: 256,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
  },
  chapterImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
}));
