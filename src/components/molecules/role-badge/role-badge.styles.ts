import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm - 2,
    paddingHorizontal: theme.spacing.md - theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
  },
}));
