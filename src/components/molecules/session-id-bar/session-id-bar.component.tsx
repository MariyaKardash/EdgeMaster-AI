import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import {
  COPIED_LABEL,
  COPY_ACCESSIBILITY_LABEL,
  COPY_FEEDBACK_DURATION_MS,
  COPY_LABEL,
  TOPIC_HEX_LABEL,
} from './session-id-bar.constants';
import { styles } from './session-id-bar.styles';
import type { SessionIdBarProps } from './session-id-bar.types';

export const SessionIdBar = ({ sessionId }: SessionIdBarProps) => {
  const [copied, setCopied] = useState(false);

  styles.useVariants({ copied });

  const handleCopy = () => {
    void Clipboard.setStringAsync(sessionId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sessionInfo}>
        <Text variant="labelMd" style={styles.sessionLabel}>
          {TOPIC_HEX_LABEL}
        </Text>
        <Text variant="codeMd" style={styles.sessionId} numberOfLines={1} ellipsizeMode="middle">
          {sessionId}
        </Text>
      </View>

      <Pressable
        style={styles.copyButton}
        onPress={handleCopy}
        accessibilityRole="button"
        accessibilityLabel={COPY_ACCESSIBILITY_LABEL}
      >
        <Icon
          name={copied ? 'check' : 'content-copy'}
          size={20}
          color={copied ? 'connected' : 'primary'}
        />
        <Text variant="labelMd" style={styles.copyLabel}>
          {copied ? COPIED_LABEL : COPY_LABEL}
        </Text>
      </Pressable>
    </View>
  );
};
