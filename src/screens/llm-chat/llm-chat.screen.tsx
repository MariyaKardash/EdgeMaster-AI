import { useEffect, useMemo, useRef, useState } from 'react';
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

import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { useCampaignChat } from '@/hooks/useCampaignChat';

import { styles } from './llm-chat.styles';
import type { CampaignChatProps, ChatMessage, MessageStats } from './llm-chat.types';

function formatStats(stats: MessageStats) {
  const parts: string[] = [];
  if (stats.ttftMs != null) {
    const seconds =
      stats.ttftMs >= 1000 ? (stats.ttftMs / 1000).toFixed(2) : stats.ttftMs.toFixed(0);
    const unit = stats.ttftMs >= 1000 ? 's' : 'ms';
    parts.push(`TTFT ${seconds}${unit}`);
  }
  if (stats.tps != null) {
    parts.push(`${stats.tps.toFixed(1)} TPS`);
  }
  return parts.join(' · ');
}

type Props = Partial<CampaignChatProps>;

export function LLMChatScreen({
  campaignId = MOCK_CAMPAIGN.id,
  campaignName = MOCK_CAMPAIGN.name,
  userRole = 'player',
}: Props) {
  const { messages, sendMessage, isGenerating, isReady, statusLabel, downloadPct } =
    useCampaignChat({
      campaignId,
      campaignName,
      userRole,
      seedDocuments: MOCK_CAMPAIGN.documents,
    });

  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

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
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : StatusBar.currentHeight || 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{campaignName}</Text>
          <Text style={styles.subtitle}>
            {statusLabel}
            {downloadPct != null ? ` (${downloadPct}%)` : ''}
          </Text>
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
              const statsLabel =
                item.role === 'assistant' && item.stats ? formatStats(item.stats) : '';
              return (
                <View
                  style={[
                    styles.bubble,
                    item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                  ]}
                >
                  <Text style={styles.bubbleText}>{item.content}</Text>
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
            editable={isReady && !isGenerating}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          {isGenerating ? <ActivityIndicator /> : null}
        </View>

        <Text style={styles.hint}>Press send/enter to submit. Messages stream token-by-token.</Text>
      </KeyboardAvoidingView>
    </View>
  );
}
