import { Text as RNText } from 'react-native';

import { styles } from './text.styles';
import type { TextPropsWithVariant } from './text.types';

export function Text({ variant = 'bodyMd', style, ...props }: TextPropsWithVariant) {
  styles.useVariants({ variant });

  return <RNText style={[styles.text, style]} {...props} />;
}
