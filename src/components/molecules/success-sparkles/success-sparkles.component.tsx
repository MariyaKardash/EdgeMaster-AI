import { useEffect, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';

import { SPARKLE_CONFIGS } from './success-sparkles.constants';
import type { SparkleConfig } from './success-sparkles.constants';
import { styles } from './success-sparkles.styles';

type FloatingSparkleProps = SparkleConfig;

const FloatingSparkle = ({ left, top, size, color, delay, duration }: FloatingSparkleProps) => {
  const opacity = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.2,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sparkle,
        {
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export const SuccessSparkles = () => (
  <View pointerEvents="none" style={styles.container}>
    {SPARKLE_CONFIGS.map((sparkle) => (
      <FloatingSparkle key={sparkle.id} {...sparkle} />
    ))}
  </View>
);
