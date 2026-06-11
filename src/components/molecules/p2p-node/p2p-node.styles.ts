import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  node: {
    position: 'absolute',
    backgroundColor: theme.colors.primary,
    zIndex: 2,
  },
}));
