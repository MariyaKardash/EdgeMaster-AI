import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { ArtifactItemCard, Button, Icon, Text, TextField } from '@/components';
import { CampaignSetupHeader } from '@/components/organisms/campaign-setup-header';
import { campaignSetupStore } from '@/stores/campaign-setup-store';
import { colors, withAlpha } from '@/theme';
import {
  DEFAULT_AVAILABLE_ITEM_IDS,
  FINALIZE_LABEL,
  FORGE_ITEM_LABEL,
  HEADER_TITLE,
  ITEM_DESCRIPTION_LABEL,
  ITEM_DESCRIPTION_PLACEHOLDER,
  ITEM_NAME_LABEL,
  ITEM_NAME_PLACEHOLDER,
  MIN_AVAILABLE_ITEMS,
  MOCK_ARTIFACTS,
  NEW_ARTIFACT_SUBTITLE,
  NEW_ARTIFACT_TITLE,
  STAT_MODIFIER_LABEL,
  STAT_MODIFIER_PLACEHOLDER,
  STAT_VALUE_LABEL,
  STAT_VALUE_PLACEHOLDER,
} from './campaign-setup-step3.constants';
import { styles } from './campaign-setup-step3.styles';
import type { CampaignSetupStep3ScreenProps } from './campaign-setup-step3.types';

export const CampaignSetupStep3Screen = ({ onFinalize, onBack }: CampaignSetupStep3ScreenProps) => {
  const [availableIds, setAvailableIds] = useState<string[]>(() =>
    campaignSetupStore.availableItemIds.length > 0
      ? campaignSetupStore.availableItemIds
      : DEFAULT_AVAILABLE_ITEM_IDS,
  );

  useEffect(() => {
    return () => {
      campaignSetupStore.resetStep3();
    };
  }, []);

  const toggleAvailability = (id: string, available: boolean) => {
    setAvailableIds((current) => {
      if (available) {
        return current.includes(id) ? current : [...current, id];
      }

      return current.filter((itemId) => itemId !== id);
    });
  };

  const handleFinalize = () => {
    if (availableIds.length < MIN_AVAILABLE_ITEMS) return;

    campaignSetupStore.setStep3({ availableItemIds: availableIds });
    onFinalize?.(availableIds);
  };

  const isFinalizeDisabled = availableIds.length < MIN_AVAILABLE_ITEMS;

  return (
    <View style={styles.container}>
      <CampaignSetupHeader step={3} title={HEADER_TITLE} onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
      >
        <View style={styles.itemList}>
          {MOCK_ARTIFACTS.map((item) => (
            <ArtifactItemCard
              key={item.id}
              item={item}
              available={availableIds.includes(item.id)}
              onToggle={(available) => toggleAvailability(item.id, available)}
            />
          ))}
        </View>

        <View style={styles.newItemCard}>
          <View style={styles.newItemIntro}>
            <View style={styles.newItemIcon}>
              <Icon name="add-circle" size={28} color="primary" />
            </View>
            <Text variant="headlineMd" style={styles.newItemTitle}>
              {NEW_ARTIFACT_TITLE}
            </Text>
            <Text variant="labelMd" style={styles.newItemSubtitle}>
              {NEW_ARTIFACT_SUBTITLE}
            </Text>
          </View>

          <View style={styles.newItemForm}>
            <View style={styles.field}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                {ITEM_NAME_LABEL}
              </Text>
              <TextField placeholder={ITEM_NAME_PLACEHOLDER} inputStyle={styles.formInput} />
            </View>

            <View style={styles.field}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                {ITEM_DESCRIPTION_LABEL}
              </Text>
              <TextInput
                placeholder={ITEM_DESCRIPTION_PLACEHOLDER}
                placeholderTextColor={withAlpha('onSurfaceVariant', 0.4)}
                multiline
                scrollEnabled
                textAlignVertical="top"
                style={[styles.formInput, styles.descriptionInput]}
                cursorColor={colors.primaryContainer}
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <Text variant="labelMd" style={styles.fieldLabel}>
                  {STAT_MODIFIER_LABEL}
                </Text>
                <TextField placeholder={STAT_MODIFIER_PLACEHOLDER} inputStyle={styles.formInput} />
              </View>

              <View style={styles.fieldHalf}>
                <Text variant="labelMd" style={styles.fieldLabel}>
                  {STAT_VALUE_LABEL}
                </Text>
                <TextField
                  placeholder={STAT_VALUE_PLACEHOLDER}
                  keyboardType="numeric"
                  inputStyle={styles.formInput}
                />
              </View>
            </View>

            <Pressable style={styles.forgeButton}>
              <Icon name="auto-fix-high" size={20} color="primary" />
              <Text style={styles.forgeButtonLabel}>{FORGE_ITEM_LABEL}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={FINALIZE_LABEL}
          icon="arrow-forward"
          fullWidth
          disabled={isFinalizeDisabled}
          onPress={handleFinalize}
        />
      </View>
    </View>
  );
};
