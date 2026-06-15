import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl * 3,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerMargin,
  },
  title: {
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  main: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  footer: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background + 'CC',
  },
}));
