import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  section: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
  },
  block: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  percentLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  stepperButton: {
    minWidth: 36,
    height: 36,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.25),
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  stepperButtonDisabled: {
    opacity: 0.35,
  },
  stepperButtonLabel: {
    fontFamily: theme.textStyles.codeMd.fontFamily,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  valueGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  valueInput: {
    minWidth: 28,
    paddingVertical: 0,
    paddingHorizontal: 2,
    fontFamily: theme.textStyles.codeMd.fontFamily,
    fontSize: theme.textStyles.codeMd.fontSize,
    lineHeight: theme.textStyles.codeMd.lineHeight,
    fontWeight: '700',
    textAlign: 'center',
  },
  currentInput: {
    color: theme.colors.primary,
  },
  currentInputLow: {
    color: theme.colors.error,
  },
  maxInput: {
    color: theme.colors.onSurfaceVariant,
  },
  separator: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '700',
  },
  barTrack: {
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  barFillLow: {
    backgroundColor: theme.colors.error,
  },
}));
