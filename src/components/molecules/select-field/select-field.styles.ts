import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  triggerDisabled: {
    opacity: 0.45,
  },
  triggerLabel: {
    flex: 1,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
  triggerPlaceholder: {
    color: theme.colors.onSurfaceVariant,
    opacity: 0.4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  optionSelected: {
    backgroundColor: withAlphaHex('primary', 0.12),
  },
  optionLabel: {
    color: theme.colors.onSurface,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
  },
  optionLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
}));
