import { useEffect, useMemo } from 'react';
import { Animated, Easing } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { colors } from '@/theme';
import { styles } from './pulsing-success-icon.styles';

export const PulsingSuccessIcon = () => {
  const glowOpacity = useMemo(() => new Animated.Value(0.15), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.35,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [glowOpacity]);

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glowOpacity,
          shadowRadius: 20,
        },
      ]}
    >
      <Icon name="auto-awesome" size={32} color="primary" />
    </Animated.View>
  );
};
