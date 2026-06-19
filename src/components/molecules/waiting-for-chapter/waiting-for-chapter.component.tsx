import { useEffect, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';

import { Icon, Text } from '@/components/atoms';

import { styles } from './waiting-for-chapter.styles';
import type { WaitingForChapterProps } from './waiting-for-chapter.types';

const ROTATION_DURATION_MS = 2000;

export const WaitingForChapter = ({ message }: WaitingForChapterProps) => {
  const rotation = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: ROTATION_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text variant="bodyMd" style={styles.message}>
        {message}
      </Text>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name="hourglass-empty" size={32} color="primary" />
      </Animated.View>
    </View>
  );
};
