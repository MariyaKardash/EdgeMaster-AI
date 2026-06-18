import { Pressable, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { styles } from './event-log-item.styles';
import type { EventLogItemProps } from './event-log-item.types';

export const EventLogItem = ({
  entry,
  isLast = false,
  isExpanded = false,
  onPress,
  onCollapse,
}: EventLogItemProps) => {
  const isInteractive = Boolean(onPress);

  const header = (
    <View style={styles.headerRow}>
      <Text variant="bodyMd" style={styles.title} numberOfLines={isExpanded ? undefined : 2}>
        {entry.title}
      </Text>
      <Text variant="labelMd" style={styles.timestamp}>
        {entry.timestamp}
      </Text>
    </View>
  );

  return (
    <View style={styles.item}>
      {!isLast ? <View style={styles.timelineLine} /> : null}

      <View style={styles.timelineNode} />

      <View style={styles.card}>
        <View style={styles.accentBar} />

        <View style={styles.cardContent}>
          {isInteractive ? (
            <Pressable
              style={({ pressed }) => [
                styles.headerPressable,
                pressed && styles.headerPressablePressed,
              ]}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              accessibilityLabel={entry.title}
            >
              {header}
            </Pressable>
          ) : (
            header
          )}

          {isExpanded ? (
            <>
              <Text variant="bodyMd" style={styles.body}>
                {entry.body}
              </Text>

              {onCollapse ? (
                <View style={styles.collapseFooter}>
                  <Pressable
                    style={styles.collapseButton}
                    onPress={onCollapse}
                    accessibilityRole="button"
                    accessibilityLabel="Collapse event"
                    hitSlop={8}
                  >
                    <Icon name="keyboard-arrow-up" size={24} color="onSurfaceVariant" />
                  </Pressable>
                </View>
              ) : null}
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};
