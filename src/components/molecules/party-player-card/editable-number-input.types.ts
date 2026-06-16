import type { StyleProp, TextStyle } from 'react-native';

export type EditableNumberInputProps = {
  value: number;
  onCommit: (value: number) => void;
  formatValue?: (value: number) => string;
  min?: number;
  max?: number;
  maxLength?: number;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};
