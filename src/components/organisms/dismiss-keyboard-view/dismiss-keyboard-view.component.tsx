import type { ReactNode } from 'react';
import { Keyboard, TouchableWithoutFeedback, View, type ViewProps } from 'react-native';

type DismissKeyboardViewProps = ViewProps & {
  children: ReactNode;
};

export const DismissKeyboardView = ({ children, style, ...props }: DismissKeyboardViewProps) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={style} {...props}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};
