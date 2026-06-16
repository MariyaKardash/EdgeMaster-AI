import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl + theme.spacing.sm,
  },
  title: {
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
  },
  cards: {
    gap: theme.spacing.lg,
  },
  footer: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.xl,
  },
}));
