import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';

import { styles } from './description-editor.styles';
import type { DescriptionEditorProps } from './description-editor.types';

const DICTATION_LABELS: Record<'idle' | 'recording' | 'processing', string> = {
  idle: 'Tap to record',
  recording: 'Recording… tap to stop',
  processing: 'Transcribing…',
};

export const DescriptionEditor = ({
  value,
  onChangeText,
  placeholder = 'Write or record a chapter description…',
  showDictation = false,
  dictationState,
  onDictationPress,
  isFixing,
  onFix,
  isModelReady,
  editable = true,
}: DescriptionEditorProps) => {
  const { theme } = useUnistyles();

  const isFixDisabled = value.trim() === '' || isFixing || !isModelReady;
  const isRecording = dictationState === 'recording';
  const isProcessing = dictationState === 'processing';

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.textArea, !editable && styles.textAreaReadOnly]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        multiline
        textAlignVertical="top"
        editable={editable}
        scrollEnabled={false}
        cursorColor={theme.colors.primaryContainer}
        selectionColor={theme.colors.primaryContainer}
      />

      {showDictation && (
        <Pressable
          style={[styles.dictationBar, isRecording && styles.dictationBarActive]}
          onPress={onDictationPress}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel={DICTATION_LABELS[dictationState]}
          hitSlop={4}
        >
          <View style={[styles.micButton, isRecording && styles.micButtonActive]}>
            {isProcessing ? (
              <ActivityIndicator size={18} color={theme.colors.primary} />
            ) : (
              <Icon
                name={isRecording ? 'mic' : 'mic-none'}
                size={20}
                color={isRecording ? 'primary' : 'onSurfaceVariant'}
              />
            )}
          </View>

          <Text style={[styles.dictationLabel, isRecording && styles.dictationLabelActive]}>
            {DICTATION_LABELS[dictationState]}
          </Text>
        </Pressable>
      )}

      <Pressable
        style={[styles.fixButton, isFixDisabled && styles.fixButtonDisabled]}
        onPress={onFix}
        disabled={isFixDisabled}
        accessibilityRole="button"
        accessibilityLabel="Format text with AI"
        hitSlop={4}
      >
        {isFixing ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <Icon
            name="auto-fix-high"
            size={14}
            color={isFixDisabled ? 'onSurfaceVariant' : 'primary'}
          />
        )}
        <Text style={[styles.fixButtonLabel, isFixDisabled && styles.fixButtonLabelDisabled]}>
          {isFixing ? 'Formatting…' : 'Format text'}
        </Text>
      </Pressable>
    </View>
  );
};
