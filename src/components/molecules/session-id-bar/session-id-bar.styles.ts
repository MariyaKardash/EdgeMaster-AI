import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flexShrink: 0,
  },
  copyLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    variants: {
      copied: {
        true: {
          color: theme.colors.connected,
        },
      },
    },
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.gutter,
    backgroundColor: withAlphaHex('surfaceContainer', 0.95),
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('primary', 0.2),
  },
  sessionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    minWidth: 0,
  },
  sessionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sessionId: {
    color: theme.colors.primary,
    fontWeight: '700',
    flexShrink: 1,
    minWidth: 0,
  },
}));
