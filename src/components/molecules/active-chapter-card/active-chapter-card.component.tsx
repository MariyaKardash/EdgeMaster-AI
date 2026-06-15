import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Button, Text } from '@/components';
import { colors, withAlpha } from '@/theme';
import { OPEN_CHAPTER_LABEL } from './active-chapter-card.constants';
import { styles } from './active-chapter-card.styles';
import type { ActiveChapterCardProps } from './active-chapter-card.types';

export const ActiveChapterCard = ({
  title,
  description,
  imageUri,
  onOpenChapter,
}: ActiveChapterCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />

      <LinearGradient
        colors={[colors.transparent, withAlpha('background', 0.9), colors.background]}
        locations={[0, 0.45, 1]}
        style={styles.overlay}
      >
        <Text variant="headlineMd" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyMd" style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Button title={OPEN_CHAPTER_LABEL} icon="arrow-forward" onPress={onOpenChapter} />
      </LinearGradient>
    </View>
  );
};
