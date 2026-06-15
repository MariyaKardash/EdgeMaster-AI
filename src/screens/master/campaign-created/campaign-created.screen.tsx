import { ScrollView, View } from 'react-native';

import {
  Button,
  CampaignSummaryCard,
  PulsingSuccessIcon,
  SessionIdCard,
  SuccessSparkles,
  Text,
} from '@/components';
import {
  MOCK_CAMPAIGN_NAME,
  MOCK_CHARACTER_COUNT,
  MOCK_ITEM_COUNT,
  MOCK_SESSION_ID,
  OPEN_DASHBOARD_LABEL,
  SUBTITLE,
  TITLE,
} from './campaign-created.constants';
import { styles } from './campaign-created.styles';
import type { CampaignCreatedScreenProps } from './campaign-created.types';

export const CampaignCreatedScreen = ({
  sessionId = MOCK_SESSION_ID,
  campaignName = MOCK_CAMPAIGN_NAME,
  characterCount = MOCK_CHARACTER_COUNT,
  itemCount = MOCK_ITEM_COUNT,
  onOpenDashboard,
}: CampaignCreatedScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer} pointerEvents="none">
        <SuccessSparkles />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <PulsingSuccessIcon />
          <Text variant="headlineLgMobile" style={styles.title}>
            {TITLE}
          </Text>
          <Text variant="bodyMd" style={styles.subtitle}>
            {SUBTITLE}
          </Text>
        </View>

        <View style={styles.main}>
          <SessionIdCard sessionId={sessionId} />
          <CampaignSummaryCard
            campaignName={campaignName}
            characterCount={characterCount}
            itemCount={itemCount}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={OPEN_DASHBOARD_LABEL}
          icon="arrow-forward"
          fullWidth
          onPress={onOpenDashboard}
        />
      </View>
    </View>
  );
};
