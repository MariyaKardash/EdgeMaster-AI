import {
  completion,
  downloadAsset,
  LLAMA_3_2_1B_INST_Q4_0,
  loadModel,
  type ModelProgressUpdate,
  unloadModel,
  VERBOSITY,
} from '@qvac/sdk';
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

import { styles } from './llm-chat.styles';
import type { ChatMessage, MessageStats } from './llm-chat.types';

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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

export function LLMChatScreen() {
  const [modelId, setModelId] = useState<string | null>(null);
  const [status, setStatus] = useState('Initializing…');
  const [downloadPct, setDownloadPct] = useState<number | null>(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const canSend = useMemo(() => {
    return !!modelId && !isGenerating && input.trim().length > 0;
  }, [modelId, isGenerating, input]);

  useEffect(() => {
    const t = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 0);
    return () => clearTimeout(t);
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus('Downloading model…');

        await downloadAsset({
          assetSrc: LLAMA_3_2_1B_INST_Q4_0,
          onProgress: (progress: ModelProgressUpdate) => {
            if (!cancelled) setDownloadPct(Math.round(progress.percentage));
          },
        });

        if (cancelled) return;

        setStatus('Loading model into memory…');

        const id = await loadModel({
          modelSrc: LLAMA_3_2_1B_INST_Q4_0,
          modelType: 'llamacpp-completion',
          modelConfig: {
            device: 'gpu',
            ctx_size: 2048,
            verbosity: VERBOSITY.ERROR,
          },
          onProgress: (progress: ModelProgressUpdate) => {
            if (!cancelled) setDownloadPct(Math.round(progress.percentage));
          },
        });

        if (cancelled) return;

        setModelId(id);
        setStatus('Ready');
        setDownloadPct(null);
      } catch (e: unknown) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : String(e);
          setStatus(`Init failed: ${message}`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (modelId) {
        void unloadModel({ modelId, clearStorage: false }).catch(() => {});
      }
    };
  }, [modelId]);

  async function handleSend() {
    if (!modelId || isGenerating || !canSend) return;

    const trimmed = input.trim();
    setInput('');
    setIsGenerating(true);

    const userMsg: ChatMessage = { id: makeId(), role: 'user', content: trimmed };
    const assistantId = makeId();
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    try {
      const history = [...messagesRef.current, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const run = completion({
        modelId,
        history,
        stream: true,
      });

      let acc = '';

      let stats: MessageStats | undefined;

      for await (const event of run.events) {
        if (event.type === 'contentDelta') {
          acc += event.text;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
        } else if (event.type === 'completionStats') {
          stats = {
            ttftMs: event.stats.timeToFirstToken,
            tps: event.stats.tokensPerSecond,
          };
        }
      }

      const final = await run.final;
      if (final.stats) {
        stats = {
          ttftMs: final.stats.timeToFirstToken ?? stats?.ttftMs,
          tps: final.stats.tokensPerSecond ?? stats?.tps,
        };
      }

      if (stats && (stats.ttftMs != null || stats.tps != null)) {
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, stats } : m)));
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: `Error: ${message}` } : m)),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : StatusBar.currentHeight || 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>LLM Chat</Text>
          <Text style={styles.subtitle}>
            {status}
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
            data={messages}
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
            placeholder={modelId ? 'Type a message…' : 'Loading model…'}
            editable={!!modelId && !isGenerating}
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
