import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('primary', 0.1),
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    minHeight: 64,
  },
  navStart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  stepLabel: {
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: theme.colors.tertiary,
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.primary,
  },
  sparkleButton: {
    padding: theme.spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: withAlphaHex('tertiary', 0.2),
  },
  progressSegmentActive: {
    backgroundColor: theme.colors.tertiary,
  },
}));
