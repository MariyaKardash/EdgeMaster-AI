import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  shadowWrapper: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
    variants: {
      fullWidth: {
        true: {
          width: '100%',
        },
      },
    },
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl + theme.spacing.sm,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.radius.md,
  },
}));
