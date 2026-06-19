import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  message: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
}));
