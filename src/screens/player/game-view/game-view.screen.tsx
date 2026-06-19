import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components';
import { MOCK_INVENTORY_ITEMS } from '@/screens/master/equip-hero';
import {
  APP_BAR_TITLE,
  MOCK_PARTY_PLAYER,
  NO_ACTIVE_CHAPTER_MESSAGE,
  PLAYER_SHEET_HEADER_HEIGHT,
} from './game-view.constants';
import { styles } from './game-view.styles';
import type { GameViewScreenProps } from './game-view.types';
import { PlayerSheet } from './player-sheet.component';

const BOTTOM_INSET_MIN = 8;

export const GameViewScreen = ({
  chapterTitle,
  chapterDescription,
  partyPlayer = MOCK_PARTY_PLAYER,
  inventoryItems = MOCK_INVENTORY_ITEMS,
  gameLog = [],
}: GameViewScreenProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, BOTTOM_INSET_MIN);
  const scrollBottomPadding = bottomInset + PLAYER_SHEET_HEADER_HEIGHT + 16;
  const hasActiveChapter = Boolean(chapterTitle);

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
        {hasActiveChapter ? (
          <>
            <Text variant="displayLg" style={styles.chapterTitle}>
              {chapterTitle}
            </Text>

            {chapterDescription ? (
              <View style={styles.narrativeCard}>
                <Text variant="headlineMd" style={styles.narrativeParagraph}>
                  {chapterDescription}
                </Text>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text variant="headlineMd" style={styles.emptyStateText}>
              {NO_ACTIVE_CHAPTER_MESSAGE}
            </Text>
          </View>
        )}
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
