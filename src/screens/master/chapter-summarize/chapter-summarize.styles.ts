import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('primary', 0.1),
  },

  backButton: {
    padding: theme.spacing.xs,
  },

  headerTitle: {
    flex: 1,
    fontFamily: theme.textStyles.headlineMd.fontFamily,
    fontSize: theme.textStyles.headlineMd.fontSize,
    lineHeight: theme.textStyles.headlineMd.lineHeight,
    fontWeight: theme.textStyles.headlineMd.fontWeight,
    color: theme.colors.primary,
  },

  modelStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.sm,
    backgroundColor: withAlphaHex('primary', 0.04),
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('primary', 0.08),
  },

  modelStatusLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.onSurfaceVariant,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xl,
  },

  chapterTitleRow: {
    gap: theme.spacing.xs,
  },

  chapterSectionLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  chapterTitle: {
    fontFamily: theme.textStyles.headlineLgMobile.fontFamily,
    fontSize: theme.textStyles.headlineLgMobile.fontSize,
    lineHeight: theme.textStyles.headlineLgMobile.lineHeight,
    color: theme.colors.onSurface,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // No-events warning
  noEventsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    backgroundColor: withAlphaHex('onSurfaceVariant', 0.06),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.4),
    padding: theme.spacing.md,
  },

  noEventsText: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  noEventsTitle: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.onSurfaceVariant,
  },

  noEventsDesc: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: withAlphaHex('onSurfaceVariant', 0.7),
  },

  // Generating indicator
  generatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },

  generatingLabel: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    color: theme.colors.onSurfaceVariant,
  },

  // Summary card
  summaryCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.2),
    padding: theme.spacing.md,
    minHeight: 160,
  },

  summaryCardGenerating: {
    borderColor: withAlphaHex('primary', 0.4),
    borderStyle: 'dashed',
  },

  summaryInput: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
    textAlignVertical: 'top',
    minHeight: 140,
    padding: 0,
  },

  editHint: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: withAlphaHex('onSurfaceVariant', 0.5),
    textAlign: 'center',
  },

  // Bottom strip
  bottomStrip: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    backgroundColor: theme.colors.background,
  },

  errorText: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    color: theme.colors.error,
  },
}));
