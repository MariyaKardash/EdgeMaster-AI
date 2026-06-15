import * as Clipboard from 'expo-clipboard';
import { useMemo, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { styles } from './session-id-card.styles';
import type { SessionIdCardProps } from './session-id-card.types';

export const SessionIdCard = ({ sessionId, label = 'Session ID' }: SessionIdCardProps) => {
  const [copied, setCopied] = useState(false);
  const cardScale = useMemo(() => new Animated.Value(1), []);

  const handleCopy = () => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    void Clipboard.setStringAsync(sessionId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <View style={styles.section}>
      <Text variant="labelMd" style={styles.label}>
        {label}
      </Text>

      <View style={styles.cardWrapper}>
        <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
          <Text variant="codeMd" style={styles.sessionId}>
            {sessionId}
          </Text>
          <Pressable
            style={styles.copyButton}
            onPress={handleCopy}
            accessibilityRole="button"
            accessibilityLabel="Copy session ID"
          >
            <Icon
              name={copied ? 'check' : 'content-copy'}
              size={24}
              color={copied ? 'connected' : 'primary'}
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};
