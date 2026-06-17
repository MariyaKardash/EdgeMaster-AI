import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  lastPlayed: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  chevron: {
    flexShrink: 0,
  },
}));
