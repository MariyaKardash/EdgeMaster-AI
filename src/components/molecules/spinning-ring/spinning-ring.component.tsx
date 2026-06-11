import { useEffect, useMemo } from 'react';
import { Animated, Easing } from 'react-native';

import { styles } from './spinning-ring.styles';
import type { SpinningRingProps } from './spinning-ring.types';

export function SpinningRing({ baseSize, inset, duration, reverse }: SpinningRingProps) {
  const rotation = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [duration, reverse, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  const size = baseSize + inset * 2;

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
}
