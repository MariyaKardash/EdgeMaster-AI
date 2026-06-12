import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, CharacterCard, Icon, Text, TextField } from '@/components';
import { CampaignSetupHeader } from '@/components/organisms/campaign-setup-header';
import {
  ARCHETYPE_LABEL,
  ARCHETYPE_PLACEHOLDER,
  DEFAULT_SELECTED_CHARACTER_IDS,
  HEADER_TITLE,
  HEROIC_NAME_LABEL,
  HEROIC_NAME_PLACEHOLDER,
  MIN_SELECTED_CHARACTERS,
  MOCK_CHARACTERS,
  NEW_HERO_SUBTITLE,
  NEW_HERO_TITLE,
  ORIGIN_LABEL,
  ORIGIN_PLACEHOLDER,
  SECTION_SUBTITLE,
} from './campaign-setup-step2.constants';
import { styles } from './campaign-setup-step2.styles';
import type { CampaignSetupStep2ScreenProps } from './campaign-setup-step2.types';

export const CampaignSetupStep2Screen = ({ onContinue, onBack }: CampaignSetupStep2ScreenProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTED_CHARACTER_IDS);

  const toggleCharacter = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((characterId) => characterId !== id) : [...current, id],
    );
  };

  const handleContinue = () => {
    if (selectedIds.length < MIN_SELECTED_CHARACTERS) return;
    onContinue?.(selectedIds);
  };

  const isContinueDisabled = selectedIds.length < MIN_SELECTED_CHARACTERS;

  return (
    <View style={styles.container}>
      <CampaignSetupHeader step={2} title={HEADER_TITLE} onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
      >
        <View style={styles.sectionHeader}>
          <Text variant="bodyMd" style={styles.sectionSubtitle}>
            {SECTION_SUBTITLE}
          </Text>
        </View>

        <View style={styles.characterList}>
          {MOCK_CHARACTERS.map((character) => (
            <CharacterCard
              key={character.id}
              player={character}
              selected={selectedIds.includes(character.id)}
              onPress={() => toggleCharacter(character.id)}
            />
          ))}
        </View>

        <View style={styles.newHeroCard}>
          <View style={styles.newHeroIntro}>
            <View style={styles.newHeroIcon}>
              <Icon name="person-add" size={28} color="primary" />
            </View>
            <Text variant="headlineMd" style={styles.newHeroTitle}>
              {NEW_HERO_TITLE}
            </Text>
            <Text variant="labelMd" style={styles.newHeroSubtitle}>
              {NEW_HERO_SUBTITLE}
            </Text>
          </View>

          <View style={styles.newHeroForm}>
            <View style={styles.field}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                {HEROIC_NAME_LABEL}
              </Text>
              <TextField placeholder={HEROIC_NAME_PLACEHOLDER} inputStyle={styles.formInput} />
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <Text variant="labelMd" style={styles.fieldLabel}>
                  {ARCHETYPE_LABEL}
                </Text>
                <TextField placeholder={ARCHETYPE_PLACEHOLDER} inputStyle={styles.formInput} />
              </View>

              <View style={styles.fieldHalf}>
                <Text variant="labelMd" style={styles.fieldLabel}>
                  {ORIGIN_LABEL}
                </Text>
                <TextField placeholder={ORIGIN_PLACEHOLDER} inputStyle={styles.formInput} />
              </View>
            </View>

            <Pressable style={styles.generateStatsButton}>
              <Icon name="auto-fix-high" size={20} color="primary" />
              <Text style={styles.generateStatsLabel}>Generate Stats</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          icon="arrow-forward"
          fullWidth
          disabled={isContinueDisabled}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
};
