import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { Button } from '@/components/molecules/button';
import { DescriptionEditor } from '@/components/organisms/description-editor';
import { useChapterSummarize } from '@/hooks/useChapterSummarize';

import {
  NO_EVENTS_DESCRIPTION,
  NO_EVENTS_TITLE,
  SAVE_BUTTON_LABEL,
  SAVING_BUTTON_LABEL,
  SCREEN_TITLE,
  SUMMARY_SECTION_TITLE,
} from './chapter-summarize.constants';
import { styles } from './chapter-summarize.styles';
import type { ChapterSummarizeScreenProps } from './chapter-summarize.types';

export function ChapterSummarizeScreen({
  chapterId,
  onBack,
  onSaved,
}: ChapterSummarizeScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const {
    chapter,
    hasEvents,
    isLoadingData,
    summaryText,
    setSummaryText,
    modelStatus,
    modelStatusLabel,
    downloadPct,
    isGenerating,
    isFixing,
    isSaving,
    errorMessage,
    dictationState,
    onDictationPress,
    handleFix,
    save,
  } = useChapterSummarize({ chapterId, onSaved });

  const isModelBusy = modelStatus === 'downloading' || modelStatus === 'loading';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" color="primary" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>{SCREEN_TITLE}</Text>
      </View>

      {/* AI model status bar — visible while preparing */}
      {(isModelBusy || modelStatus === 'error') && (
        <View style={styles.modelStatusRow}>
          {isModelBusy && <ActivityIndicator size={12} color={theme.colors.onSurfaceVariant} />}
          <Text style={styles.modelStatusLabel}>
            {modelStatusLabel}
            {downloadPct != null ? `  ${downloadPct}%` : ''}
          </Text>
        </View>
      )}

      {isLoadingData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + theme.spacing.xl },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
          >
            {/* Chapter title */}
            {chapter && (
              <View style={styles.chapterTitleRow}>
                <Text style={styles.chapterSectionLabel}>Chapter</Text>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </View>
            )}

            {/* No-events warning */}
            {!hasEvents && (
              <View style={styles.noEventsBox}>
                <Icon name="history-toggle-off" size={28} color="onSurfaceVariant" />
                <View style={styles.noEventsText}>
                  <Text style={styles.noEventsTitle}>{NO_EVENTS_TITLE}</Text>
                  <Text style={styles.noEventsDesc}>{NO_EVENTS_DESCRIPTION}</Text>
                </View>
              </View>
            )}

            {/* Generating indicator (before any text arrives) */}
            {isGenerating && !summaryText && (
              <View style={styles.generatingRow}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.generatingLabel}>Writing summary…</Text>
              </View>
            )}

            {/* Summary editor — always shown once data is loaded */}
            {!isLoadingData && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{SUMMARY_SECTION_TITLE}</Text>

                <DescriptionEditor
                  value={summaryText}
                  onChangeText={setSummaryText}
                  placeholder="Dictate or write your session recap…"
                  showDictation
                  dictationState={dictationState}
                  onDictationPress={onDictationPress}
                  isFixing={isFixing}
                  onFix={handleFix}
                  isModelReady={modelStatus === 'ready'}
                  editable={!isGenerating && !isSaving}
                />
              </View>
            )}
          </ScrollView>

          {/* Bottom strip */}
          <View style={[styles.bottomStrip, { paddingBottom: insets.bottom + theme.spacing.md }]}>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <Button
              title={isSaving ? SAVING_BUTTON_LABEL : SAVE_BUTTON_LABEL}
              icon="check-circle-outline"
              fullWidth
              disabled={!summaryText.trim() || isSaving || isGenerating}
              onPress={save}
            />
          </View>
        </>
      )}
    </View>
  );
}
