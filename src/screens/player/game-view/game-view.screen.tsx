import { Image } from 'expo-image';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components';
import { MOCK_INVENTORY_ITEMS } from '@/screens/master/equip-hero';
import {
  APP_BAR_TITLE,
  CHAPTER_IMAGE_URI,
  CHAPTER_TITLE,
  MOCK_GAME_LOG,
  MOCK_NARRATIVE,
  MOCK_PARTY_PLAYER,
  PLAYER_SHEET_HEADER_HEIGHT,
} from './game-view.constants';
import { styles } from './game-view.styles';
import type { GameViewScreenProps } from './game-view.types';
import { PlayerSheet } from './player-sheet.component';

const BOTTOM_INSET_MIN = 8;

export const GameViewScreen = ({
  chapterTitle = CHAPTER_TITLE,
  narrative = MOCK_NARRATIVE,
  chapterImageUri = CHAPTER_IMAGE_URI,
  partyPlayer = MOCK_PARTY_PLAYER,
  inventoryItems = MOCK_INVENTORY_ITEMS,
  gameLog = MOCK_GAME_LOG,
}: GameViewScreenProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, BOTTOM_INSET_MIN);
  const scrollBottomPadding = bottomInset + PLAYER_SHEET_HEADER_HEIGHT + 16;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Icon name="auto-awesome" size={24} color="primary" />
          <Text variant="headlineMd" style={styles.brandTitle}>
            {APP_BAR_TITLE}
          </Text>
        </View>
        <Pressable
          style={styles.sensorsButton}
          accessibilityRole="button"
          accessibilityLabel="Connection status"
        >
          <Icon name="sensors" size={24} color="onSurfaceVariant" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="displayLg" style={styles.chapterTitle}>
          {chapterTitle}
        </Text>

        <View style={styles.narrativeCard}>
          {narrative.map((paragraph, index) => {
            if (paragraph.variant === 'quote') {
              return (
                <View key={index}>
                  <Text variant="headlineMd" style={styles.narrativeQuote}>
                    {paragraph.text}
                  </Text>
                  <View style={styles.chapterImageWrapper}>
                    <Image
                      source={{ uri: chapterImageUri }}
                      style={styles.chapterImage}
                      contentFit="cover"
                    />
                  </View>
                </View>
              );
            }

            return (
              <Text key={index} variant="headlineMd" style={styles.narrativeParagraph}>
                {paragraph.text}
              </Text>
            );
          })}
        </View>
      </ScrollView>

      <PlayerSheet
        safeAreaBottom={bottomInset}
        partyPlayer={partyPlayer}
        inventoryItems={inventoryItems}
        gameLog={gameLog}
      />
    </View>
  );
};
