import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  shadowWrapper: {
    width: '100%',
    borderRadius: theme.radius.lg,
  },
  card: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: theme.radius.full,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  title: {
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  description: {
    color: theme.colors.onSurfaceVariant,
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    zIndex: 2,
  },
}));
