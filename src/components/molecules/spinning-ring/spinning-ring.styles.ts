import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  ring: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: withAlphaHex('primary', 0.1),
  },
}));
