import { TextProps, TextStyle } from 'react-native';
import type { UnistylesVariants } from 'react-native-unistyles';

import { styles } from './text.styles';

export type TextVariant = NonNullable<UnistylesVariants<typeof styles>['variant']>;

export type TextPropsWithVariant = TextProps & {
  variant?: TextVariant;
  style?: TextStyle | TextStyle[];
};
