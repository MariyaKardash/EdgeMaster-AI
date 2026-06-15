import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/atoms/text';
import { styles } from './connected-player-avatar.styles';
import type { ConnectedPlayerAvatarProps } from './connected-player-avatar.types';

export const ConnectedPlayerAvatar = ({ player, onPress }: ConnectedPlayerAvatarProps) => {
  const isConnected = player.connected ?? true;

  styles.useVariants({ connected: isConnected });

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${player.name}, ${player.class}`}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Image source={{ uri: player.imageUri }} style={styles.avatarImage} contentFit="cover" />
        </View>
        {player.connected && <View style={styles.statusDot} />}
      </View>

      <Text variant="labelMd" style={styles.name} numberOfLines={1}>
        {player.name}
      </Text>
      <Text variant="labelMd" style={styles.classLabel} numberOfLines={1}>
        {player.class}
      </Text>
    </Pressable>
  );
};
