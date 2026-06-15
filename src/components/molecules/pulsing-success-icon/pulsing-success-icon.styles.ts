import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '1A',
    borderWidth: 1,
    borderColor: theme.colors.primary + '4D',
    marginBottom: theme.spacing.md,
  },
}));
