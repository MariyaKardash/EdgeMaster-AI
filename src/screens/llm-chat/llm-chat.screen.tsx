import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { useCampaignChat } from '@/hooks/useCampaignChat';

import { styles } from './llm-chat.styles';
import type { CampaignChatProps, ChatMessage } from './llm-chat.types';
import { formatStats } from './llm-chat.utils';

type Props = CampaignChatProps & {
  footer?: ReactNode;
};

export function LLMChatScreen({ campaignId, campaignName, seedDocuments, footer }: Props) {
  const { messages, sendMessage, isGenerating, isReady, statusLabel, downloadPct } =
    useCampaignChat({
      campaignId,
      campaignName,
      seedDocuments,
    });

  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const canSend = useMemo(
    () => isReady && !isGenerating && input.trim().length > 0,
    [isReady, isGenerating, input],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 0);
    return () => clearTimeout(t);
  }, [messages]);

  async function handleSend() {
    if (!canSend) return;
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  }

  const visibleMessages = messages.filter((m) => m.role !== 'system');

  return (
    <View
      style={[styles.safe, { paddingTop: insets.top, paddingBottom: footer ? 0 : insets.bottom }]}
    >
      <KeyboardAvoidingView
        style={styles.safe}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : StatusBar.currentHeight || 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{campaignName}</Text>
          {!isReady && (
            <Text style={styles.subtitle}>
              {statusLabel}
              {downloadPct != null ? ` (${downloadPct}%)` : ''}
            </Text>
          )}
          {downloadPct != null && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${downloadPct}%` }]} />
            </View>
          )}
        </View>

        <View style={styles.chat}>
          <FlatList
            ref={listRef}
            data={visibleMessages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => {
              const isUser = item.role === 'user';
              const statsLabel = !isUser && item.stats ? formatStats(item.stats) : '';
              return (
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                  <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
                    {item.content}
                  </Text>
                  {statsLabel ? <Text style={styles.bubbleStats}>{statsLabel}</Text> : null}
                </View>
              );
            }}
            contentContainerStyle={styles.chatContent}
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={isReady ? 'Ask about the campaign…' : 'Loading…'}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            editable={isReady && !isGenerating}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          {isGenerating ? <ActivityIndicator color={theme.colors.primary} /> : null}
        </View>
      </KeyboardAvoidingView>

      {footer}
    </View>
  );
}
