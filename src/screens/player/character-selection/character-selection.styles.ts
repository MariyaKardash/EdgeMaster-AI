import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  header: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.containerMargin,
    zIndex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.onSurface,
  },
  subtitle: {
    opacity: 0.8,
  },
  heroList: {
    flex: 1,
  },
  heroListContent: {
    paddingVertical: theme.spacing.xs,
  },
  footer: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.containerMargin,
    zIndex: 1,
    backgroundColor: theme.colors.background,
  },
}));
