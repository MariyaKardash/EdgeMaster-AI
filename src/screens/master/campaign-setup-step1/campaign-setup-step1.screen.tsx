import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { Button, Icon, Text, TextField } from '@/components';
import { CampaignSetupHeader } from '@/components/organisms/campaign-setup-header';
import { campaignSetupStep1Schema } from '@/database/entities';
import { campaignSetupStore } from '@/stores/campaign-setup-store';
import { colors, withAlpha } from '@/theme';
import {
  CAMPAIGN_NAME_LABEL,
  CAMPAIGN_NAME_PLACEHOLDER,
  DESCRIPTION_LABEL,
  DESCRIPTION_PLACEHOLDER,
  NEXT_PHASE_BODY,
  NEXT_PHASE_TITLE,
  SUBTITLE,
  TITLE,
} from './campaign-setup-step1.constants';
import { styles } from './campaign-setup-step1.styles';
import type {
  CampaignSetupStep1FormValues,
  CampaignSetupStep1ScreenProps,
} from './campaign-setup-step1.types';

export function CampaignSetupStep1Screen({ onContinue, onBack }: CampaignSetupStep1ScreenProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CampaignSetupStep1FormValues>({
    resolver: zodResolver(campaignSetupStep1Schema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    return () => {
      campaignSetupStore.resetStep1();
    };
  }, []);

  const onSubmit = (values: CampaignSetupStep1FormValues) => {
    campaignSetupStore.setStep1(values);
    onContinue?.(values);
  };

  return (
    <View style={styles.container}>
      <CampaignSetupHeader step={1} title={TITLE} onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
      >
        <Text variant="bodyMd" style={styles.subtitle}>
          {SUBTITLE}
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text variant="labelMd" style={styles.fieldLabel}>
              {CAMPAIGN_NAME_LABEL}
            </Text>

            <View style={styles.nameInputWrapper}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TextField
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    onBlur={onBlur}
                    placeholder={CAMPAIGN_NAME_PLACEHOLDER}
                    autoCorrect={false}
                    inputStyle={styles.nameInput}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text variant="labelMd" style={styles.fieldLabel}>
              {DESCRIPTION_LABEL}
            </Text>

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  error={error?.message}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={DESCRIPTION_PLACEHOLDER}
                  placeholderTextColor={withAlpha('onSurfaceVariant', 0.4)}
                  multiline
                  scrollEnabled
                  textAlignVertical="top"
                  inputStyle={styles.descriptionInput}
                  cursorColor={colors.primaryContainer}
                  selectionColor={colors.primaryContainer}
                />
              )}
            />
          </View>

          <View style={styles.nextPhaseCard}>
            <View style={styles.nextPhaseWatermark} pointerEvents="none">
              <Icon name="history-edu" size={64} color="onSurfaceVariant" />
            </View>

            <View style={styles.nextPhaseContent}>
              <View style={styles.nextPhaseIcon}>
                <Icon name="group-add" size={24} color="tertiary" />
              </View>

              <View style={styles.nextPhaseText}>
                <Text variant="headlineMd" style={styles.nextPhaseTitle}>
                  {NEXT_PHASE_TITLE}
                </Text>
                <Text variant="bodyMd" style={styles.nextPhaseBody}>
                  {NEXT_PHASE_BODY}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          icon="arrow-forward"
          fullWidth
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
