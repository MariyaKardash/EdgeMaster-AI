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
    borderBottomColor: withAlphaHex('primary', 0.2),
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
    paddingHorizontal: theme.spacing.gutter,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
  },
  activeCount: {
    color: theme.colors.onSurfaceVariant,
  },
  playersRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
}));
