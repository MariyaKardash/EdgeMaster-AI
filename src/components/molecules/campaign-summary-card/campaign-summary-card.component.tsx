import { View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { styles } from './campaign-summary-card.styles';
import type { CampaignSummaryCardProps } from './campaign-summary-card.types';

export const CampaignSummaryCard = ({
  campaignName,
  characterCount,
  itemCount,
}: CampaignSummaryCardProps) => {
  return (
    <View style={styles.card}>
      <Text variant="headlineMd" style={styles.title}>
        {campaignName}
      </Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Icon name="group" size={20} color="primary" />
          <Text variant="bodyMd" style={styles.text}>
            {characterCount} Characters Ready
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="inventory-2" size={20} color="primary" />
          <Text variant="bodyMd" style={styles.text}>
            {itemCount} Items Prepared
          </Text>
        </View>
      </View>
    </View>
  );
};
