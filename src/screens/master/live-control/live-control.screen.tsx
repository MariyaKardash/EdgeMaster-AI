import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  CombatLogEntry,
  getSessionDashboardBottomNavHeight,
  Icon,
  SessionDashboardBottomNav,
  Text,
  TextField,
} from '@/components';
import {
  createEventLogEntry,
  MOCK_EVENT_LOG,
  SUMMARIZE_END_CHAPTER_LABEL,
} from './live-control.constants';
import { styles } from './live-control.styles';
import type { LiveControlScreenProps } from './live-control.types';

export const LiveControlScreen = ({
  liveSessionLabel = 'LIVE SESSION',
  chapterTitle = 'The Sunken Marshes',
  chapterSubtitle = 'Chapter IV: The Whispering Reeds',
  logEntries: initialLogEntries = MOCK_EVENT_LOG,
  onExecuteEvent,
  onSummarizeAndEndChapter,
  onTabPress,
}: LiveControlScreenProps) => {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState('');
  const [logEntries, setLogEntries] = useState(initialLogEntries);
  const floatingSummaryBottom = getSessionDashboardBottomNavHeight(insets.bottom) + 16;
  const bottomPadding =
    getSessionDashboardBottomNavHeight(insets.bottom) + (onSummarizeAndEndChapter ? 96 : 24);

  const handleExecuteEvent = () => {
    const message = description.trim();
    if (!message) {
      return;
    }

    setLogEntries((current) => [createEventLogEntry(message), ...current]);
    setDescription('');
    onExecuteEvent?.(message);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.sessionHeader}>
          <Text variant="labelMd" style={styles.liveSessionLabel}>
            {liveSessionLabel}
          </Text>
          <Text variant="headlineLgMobile" style={styles.chapterTitle}>
            {chapterTitle}
          </Text>
          <View style={styles.chapterSubtitleRow}>
            <Icon name="bookmark-border" size={18} color="onSurfaceVariant" />
            <Text variant="bodyMd" style={styles.chapterSubtitle}>
              {chapterSubtitle}
            </Text>
          </View>
        </View>

        <View style={styles.eventCard}>
          <View style={styles.eventCardGlow} pointerEvents="none" />

          <Text variant="headlineMd" style={styles.sectionTitle}>
            Add New Event
          </Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Event Description
              </Text>
              <TextField
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Goblin Boss lands a critical strike on Valerius."
                multiline
                numberOfLines={5}
                inputStyle={styles.descriptionInput}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Execute Event"
              icon="bolt"
              fullWidth
              disabled={!description.trim()}
              onPress={handleExecuteEvent}
            />
          </View>
        </View>

        <View style={styles.logSection}>
          <View style={styles.logHeader}>
            <Icon name="history" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.logTitle}>
              Live Log
            </Text>
          </View>

          <View style={styles.logContainer}>
            {logEntries.map((entry, index) => (
              <CombatLogEntry
                key={entry.id}
                entry={entry}
                isLast={index === logEntries.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {onSummarizeAndEndChapter ? (
        <View style={[styles.floatingSummaryContainer, { bottom: floatingSummaryBottom }]}>
          <Pressable
            style={({ pressed }) => [
              styles.floatingSummaryButton,
              pressed && styles.floatingSummaryButtonPressed,
            ]}
            onPress={onSummarizeAndEndChapter}
            accessibilityRole="button"
            accessibilityLabel={SUMMARIZE_END_CHAPTER_LABEL}
          >
            <Icon name="logout" size={18} color="tertiary" />
            <Text variant="bodyMd" style={styles.floatingSummaryLabel}>
              {SUMMARIZE_END_CHAPTER_LABEL}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <SessionDashboardBottomNav onTabPress={onTabPress} />
    </View>
  );
};
