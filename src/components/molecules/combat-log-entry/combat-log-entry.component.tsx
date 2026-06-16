import { View } from 'react-native';

import { Text } from '@/components/atoms/text';
import { styles } from './combat-log-entry.styles';
import type { EventLogEntryProps } from './combat-log-entry.types';

export const CombatLogEntry = ({ entry, isLast = false }: EventLogEntryProps) => {
  return (
    <View style={styles.item}>
      {!isLast ? <View style={styles.timelineLine} /> : null}

      <View style={styles.timelineNode} />

      <View style={styles.card}>
        <View style={styles.accentBar} />

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text variant="labelMd" style={styles.timestamp}>
              {entry.timestamp}
            </Text>
          </View>

          <Text variant="bodyMd" style={styles.message}>
            {entry.message}
          </Text>
        </View>
      </View>
    </View>
  );
};
