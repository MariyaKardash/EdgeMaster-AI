import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    padding: theme.spacing.lg,
    overflow: 'hidden',
    gap: theme.spacing.lg,
  },
  ambientGlow: {
    position: 'absolute',
    bottom: -80,
    left: -64,
    width: 160,
    height: 160,
    borderRadius: theme.radius.full,
    backgroundColor: withAlphaHex('tertiary', 0.05),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    zIndex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.primary,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
  },
  sessionInfo: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.3),
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
    zIndex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sessionName: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  sessionNumber: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  lastPlayed: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
  },
  action: {
    zIndex: 1,
  },
}));
