import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.sm,
  },

  textArea: {
    minHeight: 160,
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
    textAlignVertical: 'top',
  },

  dictationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.4),
  },

  dictationBarActive: {
    borderColor: withAlphaHex('primary', 0.3),
    backgroundColor: withAlphaHex('primary', 0.05),
  },

  micButton: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlphaHex('onSurfaceVariant', 0.08),
  },

  micButtonActive: {
    backgroundColor: withAlphaHex('primary', 0.15),
  },

  dictationLabel: {
    flex: 1,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },

  dictationLabelActive: {
    color: theme.colors.primary,
  },

  fixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: withAlphaHex('primary', 0.08),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.2),
  },

  fixButtonDisabled: {
    opacity: 0.4,
  },

  fixButtonLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.primary,
  },

  fixButtonLabelDisabled: {
    color: theme.colors.onSurfaceVariant,
  },
}));
