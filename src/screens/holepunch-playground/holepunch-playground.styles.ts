import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl + theme.spacing.lg,
  },
  hero: {
    gap: theme.spacing.sm,
  },
  section: {
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: theme.colors.primaryContainer,
  },
  segmentLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  segmentLabelActive: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  code: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.onSurfaceVariant,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
  },
  actionButtonLabel: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  secondaryButtonLabel: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  chatComposer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
  },
  sendButton: {
    flex: 0,
    minWidth: 88,
  },
  timeline: {
    gap: theme.spacing.md,
  },
  timelineItem: {
    gap: theme.spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.outlineVariant,
    paddingBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
  },
  remoteText: {
    color: theme.colors.connected,
  },
  localText: {
    color: theme.colors.primary,
  },
}));
