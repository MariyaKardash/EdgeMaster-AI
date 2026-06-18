import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    width: 72,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    overflow: 'hidden',
    variants: {
      connected: {
        true: {
          borderColor: theme.colors.primary,
        },
        false: {
          borderColor: withAlphaHex('primary', 0.4),
        },
      },
    },
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlphaHex('surfaceContainerHighest', 0.8),
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.connected,
    borderWidth: 2,
    borderColor: theme.colors.background,
    zIndex: 2,
  },
  name: {
    color: theme.colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
  },
  classLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
}));
