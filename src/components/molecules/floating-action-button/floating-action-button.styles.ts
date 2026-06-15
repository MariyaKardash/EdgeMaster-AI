import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.tertiaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
}));
