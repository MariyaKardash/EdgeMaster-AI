import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';
import { TAB_BAR_HEIGHT } from './session-dashboard-bottom-nav.constants';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TAB_BAR_HEIGHT,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.gutter,
    backgroundColor: withAlphaHex('surfaceContainerHighest', 0.9),
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
    variants: {
      active: {
        true: {
          backgroundColor: withAlphaHex('primary', 0.1),
          borderRadius: theme.radius.lg,
        },
      },
    },
  },
  tabLabel: {
    fontSize: 12,
    variants: {
      active: {
        true: {
          color: theme.colors.primary,
          fontWeight: '700',
        },
        false: {
          color: theme.colors.onSurfaceVariant,
        },
      },
    },
  },
}));
