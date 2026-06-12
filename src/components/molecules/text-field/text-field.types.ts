import type { TextInputProps, TextStyle, ViewStyle } from 'react-native';

export type TextFieldProps = TextInputProps & {
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};
