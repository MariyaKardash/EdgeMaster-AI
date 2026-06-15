import { ScrollView, View } from 'react-native';

import { ButtonSecondary, ContinueCampaignCard, NewCampaignCard, Text } from '@/components';
import { styles } from './campaign-selection.styles';
import type { CampaignSelectionScreenProps } from './campaign-selection.types';

export const CampaignSelectionScreen = ({
  campaigns,
  isLoading,
  onBack,
  onStartNew,
  onContinue,
}: CampaignSelectionScreenProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineLgMobile" style={styles.title}>
            Your Journey Awaits
          </Text>
          <Text variant="bodyLg" style={styles.subtitle}>
            Forge a new legend or return to an ongoing saga in the realm of endless possibilities.
          </Text>
        </View>

        <View style={styles.cards}>
          <NewCampaignCard onPress={() => onStartNew?.()} />
          {isLoading ? (
            <Text variant="bodyMd" style={styles.subtitle}>
              Loading campaigns...
            </Text>
          ) : null}
          {campaigns?.map((campaign) => (
            <ContinueCampaignCard
              key={campaign.campaignId}
              session={campaign}
              onPress={() => onContinue?.(campaign)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ButtonSecondary
          title="Back"
          icon="arrow-back"
          iconPosition="leading"
          fullWidth
          onPress={onBack}
        />
      </View>
    </View>
  );
};
