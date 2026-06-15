import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl + theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  sectionHeader: {
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  sectionSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 360,
  },
  characterList: {
    gap: theme.spacing.md,
  },
  newHeroCard: {
    marginTop: theme.spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: withAlphaHex('primary', 0.2),
    borderRadius: theme.radius.lg,
    backgroundColor: withAlphaHex('surfaceContainerLowest', 0.5),
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  newHeroIntro: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  newHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: withAlphaHex('primary', 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  newHeroTitle: {
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  newHeroSubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  newHeroForm: {
    gap: theme.spacing.md,
  },
  field: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    color: withAlphaHex('primary', 0.7),
    marginLeft: theme.spacing.xs,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  fieldHalf: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  formInput: {
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
  statsSection: {
    gap: theme.spacing.sm,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  statsHeaderLabel: {
    color: withAlphaHex('primary', 0.7),
    marginLeft: theme.spacing.xs,
  },
  manualStatsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  manualStatField: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  manualStatLabel: {
    color: withAlphaHex('primary', 0.7),
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statInput: {
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  footer: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    backgroundColor: withAlphaHex('surfaceContainerLowest', 0.8),
  },
}));
