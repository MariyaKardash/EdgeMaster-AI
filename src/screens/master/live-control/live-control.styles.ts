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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  sessionHeader: {
    gap: theme.spacing.sm,
  },
  liveSessionLabel: {
    color: theme.colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  chapterTitle: {
    color: theme.colors.onSurface,
  },
  chapterSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  chapterSubtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  eventCard: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: withAlphaHex('primaryContainer', 0.1),
    padding: theme.spacing.containerMargin,
    overflow: 'hidden',
    gap: theme.spacing.md,
  },
  eventCardGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    borderBottomLeftRadius: 128,
    backgroundColor: withAlphaHex('primary', 0.05),
  },
  sectionTitle: {
    color: theme.colors.onBackground,
  },
  form: {
    gap: theme.spacing.lg,
  },
  field: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  descriptionInput: {
    minHeight: 128,
    textAlignVertical: 'top',
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('outlineVariant', 0.2),
    paddingTop: theme.spacing.md,
  },
  logSection: {
    gap: theme.spacing.md,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logTitle: {
    color: theme.colors.onBackground,
  },
  logContainer: {
    gap: 0,
  },
  floatingSummaryContainer: {
    position: 'absolute',
    left: theme.spacing.containerMargin,
    right: theme.spacing.containerMargin,
    zIndex: 12,
  },
  floatingSummaryButton: {
    minHeight: 56,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('tertiary', 0.5),
    backgroundColor: withAlphaHex('surfaceContainerLow', 0.95),
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    shadowColor: theme.colors.tertiary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  floatingSummaryButtonPressed: {
    opacity: 0.78,
  },
  floatingSummaryLabel: {
    color: theme.colors.tertiary,
  },
}));
