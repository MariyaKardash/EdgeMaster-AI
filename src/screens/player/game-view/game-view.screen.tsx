import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventLogItem, Icon, Text, WaitingForChapter } from '@/components';
import { MOCK_INVENTORY_ITEMS } from '@/screens/master/equip-hero';
import { styles as liveControlStyles } from '@/screens/master/live-control/live-control.styles';

import {
  AWAITING_CHAPTER_TITLE,
  MOCK_PARTY_PLAYER,
  PLAYER_EMPTY_EVENTS_LOG_MESSAGE,
  PLAYER_SHEET_HEADER_HEIGHT,
  WAITING_FOR_CHAPTER_MESSAGE,
} from './game-view.constants';
import { styles } from './game-view.styles';
import type { GameViewScreenProps } from './game-view.types';
import { PlayerSheet } from './player-sheet.component';

const BOTTOM_INSET_MIN = 8;

export const GameViewScreen = ({
  hasActiveChapter = false,
  chapterTitle = null,
  chapterDescription = null,
  logEntries = [],
  isLoadingEvents = false,
  partyPlayer = MOCK_PARTY_PLAYER,
  inventoryItems = MOCK_INVENTORY_ITEMS,
  isChatEnabled = false,
  onChatPress,
}: GameViewScreenProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, BOTTOM_INSET_MIN);
  const scrollBottomPadding = bottomInset + PLAYER_SHEET_HEADER_HEIGHT + 16;
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const topBarTitle = hasActiveChapter
    ? (chapterTitle ?? 'Loading chapter…')
    : AWAITING_CHAPTER_TITLE;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.chapterTitleRow}>
          <Icon name="bookmark-border" size={28} color="onSurface" />
          <Text variant="headlineLgMobile" style={styles.chapterTitle} numberOfLines={2}>
            {topBarTitle}
          </Text>
        </View>
        <Pressable
          style={[styles.chatButton, !isChatEnabled && styles.chatButtonDisabled]}
          onPress={isChatEnabled ? onChatPress : undefined}
          disabled={!isChatEnabled}
          accessibilityRole="button"
          accessibilityLabel={
            isChatEnabled
              ? 'Open campaign chat'
              : 'Campaign chat unavailable until you join a session'
          }
          accessibilityState={{ disabled: !isChatEnabled }}
        >
          <Icon
            name="chat-bubble"
            size={24}
            color={isChatEnabled ? 'onSurfaceVariant' : 'outlineVariant'}
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={liveControlStyles.sessionHeader}>
          <Text variant="labelMd" style={liveControlStyles.liveSessionLabel}>
            LIVE SESSION
          </Text>
        </View>

        <View style={liveControlStyles.logSection}>
          <View style={liveControlStyles.logHeader}>
            <Icon name="history" size={24} color="primary" />
            <Text variant="headlineMd" style={liveControlStyles.logTitle}>
              Events Log
            </Text>
          </View>

          <View style={liveControlStyles.logContainer}>
            {!hasActiveChapter ? (
              <WaitingForChapter message={WAITING_FOR_CHAPTER_MESSAGE} />
            ) : isLoadingEvents ? (
              <ActivityIndicator
                size="small"
                color="primary"
                style={liveControlStyles.logLoading}
              />
            ) : logEntries.length === 0 ? (
              <Text variant="bodyMd" style={liveControlStyles.emptyLogMessage}>
                {PLAYER_EMPTY_EVENTS_LOG_MESSAGE}
              </Text>
            ) : (
              logEntries.map((entry, index) => (
                <EventLogItem
                  key={entry.id}
                  entry={entry}
                  isLast={index === logEntries.length - 1}
                  isExpanded={expandedEventId === entry.id}
                  onPress={() => setExpandedEventId(entry.id)}
                  onCollapse={() => setExpandedEventId(null)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <PlayerSheet
        safeAreaBottom={bottomInset}
        partyPlayer={partyPlayer}
        inventoryItems={inventoryItems}
        hasActiveChapter={hasActiveChapter}
        chapterTitle={chapterTitle}
        chapterDescription={chapterDescription}
      />
    </View>
  );
};
