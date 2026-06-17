import { ActivityIndicator, Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Button } from '@/components/molecules/button';
import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { DescriptionEditor } from '@/components/organisms/description-editor';
import { useNewChapter } from '@/hooks/useNewChapter';

import {
  DESCRIPTION_PLACEHOLDER,
  DESCRIPTION_PLACEHOLDER_DOC,
  DESCRIPTION_PLACEHOLDER_PROMPT,
  PROMPT_PLACEHOLDER,
  TABS,
  TAB_LABELS,
  TITLE_PLACEHOLDER,
} from './new-chapter.constants';
import { styles } from './new-chapter.styles';
import type { NewChapterScreenProps } from './new-chapter.types';

export const NewChapterScreen = ({ campaignId, onBack, onSave }: NewChapterScreenProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const {
    title,
    setTitle,
    description,
    setDescription,
    activeTab,
    setActiveTab,
    promptText,
    setPromptText,
    dictationState,
    onDictationPress,
    docState,
    handleDocPick,
    isFixing,
    isGenerating,
    isModelReady,
    modelStatusLabel,
    downloadPct,
    handleFix,
    handleGenerate,
    handleSave,
    isSaving,
    errorMessage,
    canSave,
  } = useNewChapter({ campaignId });

  const onSavePress = async () => {
    await handleSave();
    onSave();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={24} color="primary" />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          New Chapter
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        {/* Title */}
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder={TITLE_PLACEHOLDER}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          cursorColor={theme.colors.primaryContainer}
          selectionColor={theme.colors.primaryContainer}
          returnKeyType="next"
          autoCapitalize="words"
        />

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
            >
              <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                {TAB_LABELS[tab]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Prompt tab — extra prompt input */}
        {activeTab === 'prompt' && (
          <View style={{ gap: theme.spacing.sm }}>
            <TextInput
              style={styles.promptInput}
              value={promptText}
              onChangeText={setPromptText}
              placeholder={PROMPT_PLACEHOLDER}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              cursorColor={theme.colors.primaryContainer}
              selectionColor={theme.colors.primaryContainer}
              autoCapitalize="sentences"
              multiline
            />

            <Pressable
              style={[
                styles.generateButton,
                (!promptText.trim() || !isModelReady || isGenerating) &&
                  styles.generateButtonDisabled,
              ]}
              onPress={() => {
                Keyboard.dismiss();
                handleGenerate();
              }}
              disabled={!promptText.trim() || !isModelReady || isGenerating}
              accessibilityRole="button"
              accessibilityLabel="Generate chapter description"
            >
              {isGenerating ? (
                <ActivityIndicator size={16} color={theme.colors.tertiary} />
              ) : (
                <Icon name="auto-awesome" size={16} color="tertiary" />
              )}
              <Text style={styles.generateButtonLabel}>
                {isGenerating ? 'Generating…' : 'Generate'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Doc tab — file picker */}
        {activeTab === 'doc' && (
          <Pressable
            style={styles.filePicker}
            onPress={handleDocPick}
            disabled={docState === 'processing'}
            accessibilityRole="button"
            accessibilityLabel="Pick a document"
          >
            {docState === 'processing' ? (
              <ActivityIndicator size={24} color={theme.colors.primary} />
            ) : (
              <Icon name="upload-file" size={28} color="onSurfaceVariant" />
            )}
            <Text style={styles.filePickerLabel}>
              {docState === 'processing' ? 'Reading file…' : 'Tap to pick a file'}
            </Text>
            {docState === 'idle' && <Text style={styles.filePickerHint}>.txt or .md</Text>}
          </Pressable>
        )}

        {/* Description editor (shared across all tabs) */}
        <DescriptionEditor
          value={description}
          onChangeText={setDescription}
          editable={activeTab === 'manual'}
          placeholder={
            activeTab === 'prompt'
              ? DESCRIPTION_PLACEHOLDER_PROMPT
              : activeTab === 'doc'
                ? DESCRIPTION_PLACEHOLDER_DOC
                : DESCRIPTION_PLACEHOLDER
          }
          showDictation={activeTab === 'manual'}
          dictationState={dictationState}
          onDictationPress={onDictationPress}
          isFixing={isFixing}
          onFix={handleFix}
          isModelReady={isModelReady}
        />
      </ScrollView>

      {/* Sticky bottom strip — intentionally outside scroll so it stays fixed at screen bottom */}
      <View style={[styles.bottomStrip, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : !isModelReady ? (
          <View style={styles.modelStatusMessage}>
            <ActivityIndicator size={12} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.modelStatusText}>
              {modelStatusLabel}
              {downloadPct != null ? ` ${downloadPct}%` : ''}
            </Text>
          </View>
        ) : null}

        <Button
          title={isSaving ? 'Saving…' : 'Save Chapter'}
          fullWidth
          disabled={!canSave}
          onPress={onSavePress}
        />
      </View>
    </View>
  );
};
