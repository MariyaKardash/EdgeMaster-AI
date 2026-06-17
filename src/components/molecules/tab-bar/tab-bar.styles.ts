import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.3),
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },

  tabItemActive: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.2),
  },

  tabLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },

  tabLabelActive: {
    color: theme.colors.primary,
  },
}));
