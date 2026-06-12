import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';

import { colors, withAlpha, withAlphaHex } from '@/theme';
import { styles } from './text-field.styles';
import type { TextFieldProps } from './text-field.types';

export const TextField = ({
  error,
  containerStyle,
  inputStyle,
  style,
  textAlign,
  placeholder,
  multiline,
  numberOfLines,
  onFocus,
  onBlur,
  onChangeText,
  cursorColor = colors.primaryContainer,
  selectionColor = withAlphaHex('primaryContainer', 0.3),
  placeholderTextColor = withAlpha('onSurfaceVariant', 0.3),
  ...props
}: TextFieldProps) => {
  const [focused, setFocused] = useState(false);
  const isCentered = textAlign === 'center';
  const useAndroidCenteredInput = Platform.OS === 'android' && isCentered;

  styles.useVariants({
    centered: isCentered,
    centeredAndroid: useAndroidCenteredInput,
    error: Boolean(error),
  });

  const handleChangeText = (value: string) => {
    onChangeText?.(useAndroidCenteredInput ? value.replace(/\n/g, '') : value);
  };

  return (
    <View style={containerStyle}>
      <TextInput
        {...props}
        textAlign={textAlign}
        placeholder={useAndroidCenteredInput && focused ? undefined : placeholder}
        numberOfLines={useAndroidCenteredInput ? 1 : numberOfLines}
        cursorColor={cursorColor}
        selectionColor={selectionColor}
        placeholderTextColor={placeholderTextColor}
        onChangeText={handleChangeText}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, inputStyle, style]}
      />
    </View>
  );
};
