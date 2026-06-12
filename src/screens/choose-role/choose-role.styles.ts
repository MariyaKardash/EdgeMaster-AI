import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
    paddingBottom: theme.spacing.xl + theme.spacing.sm,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.containerMargin,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 512,
    alignSelf: 'center',
    gap: theme.spacing.lg,
  },
  cards: {
    width: '100%',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.lg,
    zIndex: 10,
    maxWidth: 384,
    alignSelf: 'center',
    width: '100%',
  },
}));
