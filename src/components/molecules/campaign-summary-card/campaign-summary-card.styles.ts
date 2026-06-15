import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.primary + '33',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  title: {
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  rows: {
    gap: theme.spacing.sm,
  },
  text: {
    color: theme.colors.onSurfaceVariant,
  },
}));
