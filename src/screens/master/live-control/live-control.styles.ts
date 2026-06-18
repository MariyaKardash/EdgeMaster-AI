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
  chapterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  chapterTitle: {
    flex: 1,
    color: theme.colors.onSurface,
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
  newEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('primaryContainer', 0.2),
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  newEventButtonPressed: {
    opacity: 0.78,
  },
  newEventButtonLabel: {
    color: theme.colors.primary,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  closeFormButton: {
    padding: theme.spacing.xs,
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
    gap: theme.spacing.md,
  },
  eventTitleInput: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.5),
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.onSurface,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
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
  errorMessage: {
    color: theme.colors.error,
  },
  logLoading: {
    paddingVertical: theme.spacing.lg,
  },
  emptyLogMessage: {
    color: theme.colors.onSurfaceVariant,
    paddingVertical: theme.spacing.md,
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
