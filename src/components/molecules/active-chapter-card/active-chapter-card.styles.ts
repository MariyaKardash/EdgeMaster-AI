import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  card: {
    position: 'relative',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.3),
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  overlay: {
    padding: theme.spacing.lg,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  title: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.lg,
    maxWidth: 320,
  },
}));
