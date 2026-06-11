import { Easing, withTiming, type SharedValue } from 'react-native-reanimated';

export function animateButtonPressIn(pressed: SharedValue<number>) {
  'worklet';
  pressed.value = withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) });
}

export function animateButtonPressOut(pressed: SharedValue<number>) {
  'worklet';
  pressed.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.cubic) });
}
