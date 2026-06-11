import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm - 2,
    paddingHorizontal: theme.spacing.md - theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}1A`,
  },
}));
