import type { TextStyle, ViewStyle } from 'react-native';

export type SelectFieldOption = {
  label: string;
  value: string;
};

export type SelectFieldProps = {
  value: string;
  options: readonly SelectFieldOption[] | readonly string[];
  placeholder?: string;
  sheetTitle?: string;
  onValueChange: (value: string) => void;
  triggerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
};
