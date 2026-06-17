import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button,
  ButtonSecondary,
  CharacterCard,
  Icon,
  SelectField,
  Text,
  TextField,
} from '@/components';
import type { CharacterStats } from '@/components/molecules/character-card';
import { STAT_LABELS } from '@/components/molecules/character-card/character-card.constants';
import { CampaignSetupHeader } from '@/components/organisms/campaign-setup-header';
import type { CampaignSetupCharacter } from '@/database/entities';
import { campaignSetupStore } from '@/stores/campaign-setup-store';
import {
  ADD_HERO_LABEL,
  ARCHETYPE_LABEL,
  ARCHETYPE_OPTIONS,
  ARCHETYPE_PLACEHOLDER,
  DEFAULT_CUSTOM_HERO_IMAGE,
  GENERATE_STATS_LABEL,
  HEADER_TITLE,
  HEROIC_NAME_LABEL,
  HEROIC_NAME_PLACEHOLDER,
  MAX_SELECTED_CHARACTERS,
  MIN_SELECTED_CHARACTERS,
  MOCK_CHARACTERS,
  NEW_HERO_SUBTITLE,
  NEW_HERO_TITLE,
  ORIGIN_LABEL,
  ORIGIN_PLACEHOLDER,
  SECTION_SUBTITLE,
  STAT_PLACEHOLDERS,
  STATS_LABEL,
} from './campaign-setup-step2.constants';
import { styles } from './campaign-setup-step2.styles';
import type {
  CampaignCharacter,
  CampaignSetupStep2ScreenProps,
  HeroStats,
  NewHeroForm,
} from './campaign-setup-step2.types';

const toSetupCharacters = (characters: CampaignCharacter[]): CampaignSetupCharacter[] =>
  characters.map((character) => ({ ...character, selected: false }));

const EMPTY_HERO_STATS: HeroStats = {
  str: '',
  dex: '',
  int: '',
};

const EMPTY_HERO_FORM: NewHeroForm = {
  name: '',
  archetype: '',
  origin: '',
};

const rollStat = () => Math.floor(Math.random() * 11) + 8;

const rollStats = (): CharacterStats => ({
  str: rollStat(),
  dex: rollStat(),
  int: rollStat(),
});

export const CampaignSetupStep2Screen = ({ onContinue, onBack }: CampaignSetupStep2ScreenProps) => {
  const [characters, setCharacters] = useState<CampaignSetupCharacter[]>(() =>
    campaignSetupStore.characters.length > 0
      ? campaignSetupStore.characters
      : toSetupCharacters(MOCK_CHARACTERS),
  );
  const [heroForm, setHeroForm] = useState<NewHeroForm>(EMPTY_HERO_FORM);
  const [heroStats, setHeroStats] = useState<HeroStats>(EMPTY_HERO_STATS);

  const selectedCount = characters.filter((character) => character.selected).length;

  const toggleCharacter = (id: string) => {
    setCharacters((current) => {
      const currentSelectedCount = current.filter((character) => character.selected).length;

      return current.map((character) => {
        if (character.id !== id) {
          return character;
        }

        if (character.selected) {
          return { ...character, selected: false };
        }

        if (currentSelectedCount >= MAX_SELECTED_CHARACTERS) {
          return character;
        }

        return { ...character, selected: true };
      });
    });
  };

  const handleContinue = () => {
    if (selectedCount < MIN_SELECTED_CHARACTERS || selectedCount > MAX_SELECTED_CHARACTERS) {
      return;
    }

    campaignSetupStore.setStep2({ characters });
    onContinue?.();
  };

  const isSelectionLimitReached = selectedCount >= MAX_SELECTED_CHARACTERS;

  const isContinueDisabled =
    selectedCount < MIN_SELECTED_CHARACTERS || selectedCount > MAX_SELECTED_CHARACTERS;

  const updateHeroForm = (key: keyof NewHeroForm, value: string) => {
    setHeroForm((current) => ({ ...current, [key]: value }));
  };

  const updateHeroStat = (key: keyof HeroStats, value: string) => {
    setHeroStats((current) => ({ ...current, [key]: value }));
  };

  const hasBasicInfo = heroForm.name.trim().length > 0 && heroForm.archetype.trim().length > 0;

  const hasStats =
    heroStats.str.trim().length > 0 &&
    heroStats.dex.trim().length > 0 &&
    heroStats.int.trim().length > 0;

  const isFormComplete = hasBasicInfo && hasStats;

  const resetHeroForm = () => {
    setHeroForm(EMPTY_HERO_FORM);
    setHeroStats(EMPTY_HERO_STATS);
  };

  const handleGenerateStats = () => {
    const rolled = rollStats();

    setHeroStats({
      str: rolled.str.toString(),
      dex: rolled.dex.toString(),
      int: rolled.int.toString(),
    });
  };

  const handleAddHero = () => {
    if (!isFormComplete) return;

    const stats: CharacterStats = {
      str: Number.parseInt(heroStats.str, 10),
      dex: Number.parseInt(heroStats.dex, 10),
      int: Number.parseInt(heroStats.int, 10),
    };

    const newHero: CampaignSetupCharacter = {
      id: `custom-${Date.now()}`,
      name: heroForm.name.trim(),
      class: heroForm.archetype.trim(),
      stats,
      imageUri: DEFAULT_CUSTOM_HERO_IMAGE,
      selected: false,
    };

    setCharacters((current) => {
      const currentSelectedCount = current.filter((character) => character.selected).length;
      const shouldSelect = currentSelectedCount < MAX_SELECTED_CHARACTERS;

      return [...current, { ...newHero, selected: shouldSelect }];
    });

    resetHeroForm();
  };

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
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              player={character}
              selected={character.selected}
              disabled={!character.selected && isSelectionLimitReached}
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
              <TextField
                placeholder={HEROIC_NAME_PLACEHOLDER}
                value={heroForm.name}
                onChangeText={(value) => updateHeroForm('name', value)}
                inputStyle={styles.formInput}
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <Text variant="labelMd" style={styles.fieldLabel}>
                  {ARCHETYPE_LABEL}
                </Text>
                <SelectField
                  value={heroForm.archetype}
                  options={ARCHETYPE_OPTIONS}
                  placeholder={ARCHETYPE_PLACEHOLDER}
                  sheetTitle={ARCHETYPE_LABEL}
                  onValueChange={(value) => updateHeroForm('archetype', value)}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text variant="labelMd" style={styles.fieldLabel}>
                  {ORIGIN_LABEL}
                </Text>
                <TextField
                  placeholder={ORIGIN_PLACEHOLDER}
                  value={heroForm.origin}
                  onChangeText={(value) => updateHeroForm('origin', value)}
                  inputStyle={styles.formInput}
                />
              </View>
            </View>

            <View style={styles.statsSection}>
              <View style={styles.statsHeader}>
                <Text variant="labelMd" style={styles.statsHeaderLabel}>
                  {STATS_LABEL}
                </Text>
                <ButtonSecondary
                  title={GENERATE_STATS_LABEL}
                  icon="auto-fix-high"
                  iconPosition="leading"
                  compact
                  onPress={handleGenerateStats}
                />
              </View>

              <View style={styles.manualStatsRow}>
                {STAT_LABELS.map((label) => {
                  const statKey = label.toLowerCase() as keyof HeroStats;

                  return (
                    <View key={label} style={styles.manualStatField}>
                      <Text variant="labelMd" style={styles.manualStatLabel}>
                        {label}
                      </Text>
                      <TextField
                        placeholder={STAT_PLACEHOLDERS[statKey]}
                        keyboardType="numeric"
                        value={heroStats[statKey]}
                        onChangeText={(value) => updateHeroStat(statKey, value)}
                        inputStyle={styles.statInput}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            <Button
              title={ADD_HERO_LABEL}
              icon="person-add"
              fullWidth
              disabled={!isFormComplete || isSelectionLimitReached}
              onPress={handleAddHero}
            />
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
