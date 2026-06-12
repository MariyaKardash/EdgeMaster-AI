import { useEffect, useMemo } from 'react';
import { Animated, Easing } from 'react-native';

import { styles } from './p2p-node.styles';
import type { P2PNodeProps } from './p2p-node.types';

export const P2PNode = ({ size, delay, style }: P2PNodeProps) => {
  const opacity = useMemo(() => new Animated.Value(0.3), []);
  const scale = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.node,
        { width: size, height: size, borderRadius: size / 2, opacity, transform: [{ scale }] },
        style,
      ]}
    />
  );
};
