import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';
import type { ChapterStatus } from '@/database/entities';

export const STATUS_COLORS: Record<ChapterStatus, string> = {
  draft: 'onSurfaceVariant',
  active: 'primary',
  completed: 'tertiary',
} as const;

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

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.gutter,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },

  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },

  statusBadgeDraft: {
    backgroundColor: withAlphaHex('onSurfaceVariant', 0.08),
    borderColor: withAlphaHex('onSurfaceVariant', 0.2),
  },

  statusBadgeActive: {
    backgroundColor: withAlphaHex('primary', 0.1),
    borderColor: withAlphaHex('primary', 0.3),
  },

  statusBadgeCompleted: {
    backgroundColor: withAlphaHex('tertiary', 0.1),
    borderColor: withAlphaHex('tertiary', 0.3),
  },

  statusBadgeTextDraft: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },

  statusBadgeTextActive: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },

  statusBadgeTextCompleted: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    color: theme.colors.tertiary,
    letterSpacing: 0.5,
  },

  metaLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  sectionBody: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },

  sectionCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.4),
    padding: theme.spacing.md,
  },

  divider: {
    height: 1,
    backgroundColor: withAlphaHex('primary', 0.08),
  },

  // Bottom action strip
  bottomStrip: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    backgroundColor: theme.colors.background,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: withAlphaHex('error', 0.35),
    backgroundColor: withAlphaHex('error', 0.06),
  },

  deleteButtonDisabled: {
    opacity: 0.4,
  },

  deleteButtonLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.error,
  },
}));
