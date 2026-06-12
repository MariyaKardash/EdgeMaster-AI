import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, ButtonSecondary, DismissKeyboardView, Icon, Text, TextField } from '@/components';
import {
  CAMPAIGN_NAME_PLACEHOLDER,
  FEATURE_ITEMS,
  KEYBOARD_SCROLL_OFFSET,
} from './join-session.constants';
import { joinSessionSchema, type JoinSessionFormValues } from './join-session.schema';
import { styles } from './join-session.styles';
import type { JoinSessionScreenProps } from './join-session.types';
import { encodeCampaignToHex } from './join-session.utils';

export const JoinSessionScreen = ({ onConnect, onBack }: JoinSessionScreenProps) => {
  const scrollRef = useRef<ScrollView>(null);

  const { control, handleSubmit } = useForm<JoinSessionFormValues>({
    resolver: zodResolver(joinSessionSchema),
    defaultValues: { campaignName: '' },
  });

  const scrollForKeyboard = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: KEYBOARD_SCROLL_OFFSET, animated: true });
    });
  };

  const onSubmit = ({ campaignName }: JoinSessionFormValues) => {
    onConnect?.({
      campaignName,
      sessionHex: encodeCampaignToHex(campaignName),
    });
  };

  return (
    <DismissKeyboardView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.iconBadge}>
              <Icon name="auto-awesome" size={32} />
            </View>

            <Text variant="joinSessionTitle">Join Adventure</Text>
            <Text variant="joinSessionSubtitle" style={styles.subtitle}>
              Enter the mystical gateway to your group`s narrative.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardOverlay} pointerEvents="none" />

            <View style={styles.form}>
              <View style={styles.inputSection}>
                <Text variant="joinSessionLabel">Session Code</Text>

                <View style={styles.inputWrapper}>
                  <Controller
                    control={control}
                    name="campaignName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onFocus={scrollForKeyboard}
                        textAlign="center"
                        placeholder={CAMPAIGN_NAME_PLACEHOLDER}
                        autoCorrect={false}
                        autoCapitalize="none"
                        inputStyle={styles.input}
                      />
                    )}
                  />
                  <View style={[styles.cornerBracket, styles.cornerTopLeft]} />
                  <View style={[styles.cornerBracket, styles.cornerTopRight]} />
                  <View style={[styles.cornerBracket, styles.cornerBottomLeft]} />
                  <View style={[styles.cornerBracket, styles.cornerBottomRight]} />
                </View>

                <Text variant="joinSessionHelper" style={styles.helperText}>
                  Ask your Dungeon Master for the session code
                </Text>
              </View>

              <View style={styles.actions}>
                <Button
                  title="Connect"
                  icon="bolt"
                  iconSize={22}
                  fullWidth
                  onPress={handleSubmit(onSubmit)}
                />

                <ButtonSecondary
                  title="Back"
                  icon="arrow-back"
                  iconPosition="leading"
                  fullWidth
                  onPress={onBack}
                />
              </View>
            </View>
          </View>

          <View style={styles.features}>
            {FEATURE_ITEMS.map((item, index) => (
              <View
                key={item.label}
                style={[styles.featureItem, index !== 0 && styles.featureDivider]}
              >
                <Icon name={item.icon} size={24} color="outline" />
                <Text variant="joinSessionFeatureLabel" style={styles.featureLabel}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </DismissKeyboardView>
  );
};
