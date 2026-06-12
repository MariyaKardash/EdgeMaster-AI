import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  shadowWrapper: {
    width: '100%',
    borderRadius: theme.radius.xl,
  },
  card: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  parchmentOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 22,
    right: 22,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    maxWidth: 240,
    textAlign: 'center',
  },
  glow: {
    position: 'absolute',
    bottom: -48,
    right: -48,
    width: 192,
    height: 192,
    borderRadius: theme.radius.full,
    opacity: 0.5,
  },
}));
