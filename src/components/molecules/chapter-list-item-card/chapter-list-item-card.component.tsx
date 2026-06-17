import { Pressable, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { CHAPTER_STATUS_LABELS } from './chapter-list-item-card.constants';
import { styles } from './chapter-list-item-card.styles';
import type { ChapterListItemCardProps } from './chapter-list-item-card.types';

export const ChapterListItemCard = ({
  title,
  description,
  status,
  dateLabel,
  onPress,
}: ChapterListItemCardProps) => {
  styles.useVariants({ status });

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${CHAPTER_STATUS_LABELS[status]} chapter: ${title}`}
    >
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <View style={styles.metaRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusLabel}>{CHAPTER_STATUS_LABELS[status]}</Text>
            </View>
            <Text style={styles.dateLabel}>{dateLabel}</Text>
          </View>
          <Text variant="headlineMd" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text variant="bodyMd" style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>
        <View style={styles.trailingIcon}>
          <Icon name="chevron-right" size={24} color="onSurfaceVariant" />
        </View>
      </View>
    </Pressable>
  );
};
