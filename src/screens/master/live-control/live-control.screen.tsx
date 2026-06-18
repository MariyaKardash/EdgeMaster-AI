import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import {
  Button,
  EventLogItem,
  getSessionDashboardBottomNavHeight,
  Icon,
  SessionDashboardBottomNav,
  Text,
} from '@/components';
import { DescriptionEditor } from '@/components/organisms/description-editor';
import { useLiveControl } from '@/hooks/useLiveControl';
import {
  DESCRIBE_EVENT_TITLE,
  EMPTY_EVENTS_LOG_MESSAGE,
  EVENT_DESCRIPTION_PLACEHOLDER,
  EVENT_TITLE_PLACEHOLDER,
  NEW_EVENT_LABEL,
  SUMMARIZE_END_CHAPTER_LABEL,
} from './live-control.constants';
import { styles } from './live-control.styles';
import type { LiveControlScreenProps } from './live-control.types';

export const LiveControlScreen = ({
  chapterId,
  onSummarizeAndEndChapter,
  onTabPress,
}: LiveControlScreenProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const {
    chapter,
    logEntries,
    title,
    setTitle,
    description,
    setDescription,
    isLoading,
    isExecuting,
    isFixing,
    isModelReady,
    errorMessage,
    dictationState,
    onDictationPress,
    handleFix,
    handleExecuteEvent,
  } = useLiveControl({ chapterId });

  const floatingSummaryBottom = getSessionDashboardBottomNavHeight(insets.bottom) + 16;
  const bottomPadding =
    getSessionDashboardBottomNavHeight(insets.bottom) + (onSummarizeAndEndChapter ? 96 : 24);
  const canAddEvent = title.trim().length > 0 && description.trim().length > 0 && !isExecuting;

  const handleCloseForm = () => {
    setIsEventFormOpen(false);
  };

  const handleAddEvent = async () => {
    const added = await handleExecuteEvent();
    if (added) {
      setIsEventFormOpen(false);
      setExpandedEventId(null);
    }
  };

  const handleEventPress = (eventId: string) => {
    setExpandedEventId(eventId);
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
            LIVE SESSION
          </Text>
          <View style={styles.chapterTitleRow}>
            <Icon name="bookmark-border" size={28} color="onSurface" />
            <Text variant="headlineLgMobile" style={styles.chapterTitle}>
              {chapter?.title ?? 'Loading chapter…'}
            </Text>
          </View>
        </View>

        {isEventFormOpen ? (
          <View style={styles.eventCard}>
            <View style={styles.eventCardGlow} pointerEvents="none" />

            <View style={styles.eventCardHeader}>
              <Text variant="headlineMd" style={styles.sectionTitle}>
                {DESCRIBE_EVENT_TITLE}
              </Text>
              <Pressable
                style={styles.closeFormButton}
                onPress={handleCloseForm}
                accessibilityRole="button"
                accessibilityLabel="Close event form"
                hitSlop={8}
              >
                <Icon name="close" size={22} color="onSurfaceVariant" />
              </Pressable>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.eventTitleInput}
                value={title}
                onChangeText={setTitle}
                placeholder={EVENT_TITLE_PLACEHOLDER}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                cursorColor={theme.colors.primaryContainer}
                selectionColor={theme.colors.primaryContainer}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
              <DescriptionEditor
                value={description}
                onChangeText={setDescription}
                placeholder={EVENT_DESCRIPTION_PLACEHOLDER}
                showDictation
                dictationState={dictationState}
                onDictationPress={onDictationPress}
                isFixing={isFixing}
                onFix={handleFix}
                isModelReady={isModelReady}
              />
            </View>

            {errorMessage ? (
              <Text variant="bodyMd" style={styles.errorMessage}>
                {errorMessage}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Button
                title={isExecuting ? 'Adding…' : 'Add Event'}
                icon="bolt"
                fullWidth
                disabled={!canAddEvent}
                onPress={() => void handleAddEvent()}
              />
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.newEventButton,
              pressed && styles.newEventButtonPressed,
            ]}
            onPress={() => setIsEventFormOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={NEW_EVENT_LABEL}
          >
            <Icon name="add" size={20} color="primary" />
            <Text variant="labelMd" style={styles.newEventButtonLabel}>
              {NEW_EVENT_LABEL}
            </Text>
          </Pressable>
        )}

        <View style={styles.logSection}>
          <View style={styles.logHeader}>
            <Icon name="history" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.logTitle}>
              Events Log
            </Text>
          </View>

          <View style={styles.logContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color="primary" style={styles.logLoading} />
            ) : logEntries.length === 0 ? (
              <Text variant="bodyMd" style={styles.emptyLogMessage}>
                {EMPTY_EVENTS_LOG_MESSAGE}
              </Text>
            ) : (
              logEntries.map((entry, index) => (
                <EventLogItem
                  key={entry.id}
                  entry={entry}
                  isLast={index === logEntries.length - 1}
                  isExpanded={expandedEventId === entry.id}
                  onPress={() => handleEventPress(entry.id)}
                  onCollapse={() => setExpandedEventId(null)}
                />
              ))
            )}
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
