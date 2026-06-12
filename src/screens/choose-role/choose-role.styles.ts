import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
  cards: {
    gap: theme.spacing.lg,
    maxWidth: 512,
    alignSelf: 'center',
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
    maxWidth: 384,
    alignSelf: 'center',
    width: '100%',
  },
}));
