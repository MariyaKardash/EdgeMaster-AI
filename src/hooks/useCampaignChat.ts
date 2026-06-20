import { completion } from '@qvac/sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { resolveChatContext } from '@/lib/campaign-documents';
import { sanitizeRagContext, truncateForChat } from '@/lib/campaign-documents/format-chat-context';
import type { CampaignDoc } from '@/types/campaign.types';
import type { ChatMessage, MessageStats } from '@/screens/llm-chat/llm-chat.types';

import { auditCompletion } from '@/lib/qvac-audit';

import {
  CHAT_MAX_CONTEXT_CHARS,
  CHAT_MAX_HISTORY_MESSAGE_CHARS,
  CHAT_MAX_HISTORY_MESSAGES,
  CHAT_MAX_OUTPUT_CHARS,
  CHAT_MAX_PREDICT_TOKENS,
} from './campaign-chat.constants';
import { useCampaignRAG } from './useCampaignRAG';
import { useLLMModel } from './useLLMModel';

function prepareChatContext(context: string | null): string | null {
  if (!context) return null;
  return truncateForChat(sanitizeRagContext(context), CHAT_MAX_CONTEXT_CHARS);
}

export type UseCampaignChatParams = {
  campaignId: string;
  campaignName: string;
  seedDocuments: CampaignDoc[];
};

export type UseCampaignChatResult = {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
  isReady: boolean;
  statusLabel: string;
  downloadPct: number | null;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildSystemPrompt(campaignName: string, context: string | null): string {
  const base =
    `You are a knowledgeable assistant for the tabletop RPG campaign "${campaignName}". ` +
    `You help everyone at the table recall campaign details, lore, and events.`;

  if (!context) {
    return (
      base +
      ` You have no recorded campaign information relevant to this question. ` +
      `Do not guess or invent lore, characters, places, or events. ` +
      `Tell the user clearly that this topic is not covered in the current campaign notes.`
    );
  }

  return (
    base +
    ` Answer ONLY using the campaign context below. ` +
    `Reply in 2–4 short sentences of plain prose. ` +
    `Do NOT copy bracket tags, headers, UUIDs, or metadata from the context. ` +
    `Do NOT invent characters, places, factions, or events that are not in the context. ` +
    `If the context does not contain the answer, say you do not have that information in the campaign notes.\n\n` +
    `Campaign context:\n${context}`
  );
}

export function useCampaignChat({
  campaignId,
  campaignName,
  seedDocuments,
}: UseCampaignChatParams): UseCampaignChatResult {
  const llm = useLLMModel();
  const rag = useCampaignRAG({ campaignId, seedDocuments });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesRef = useRef<ChatMessage[]>([]);
  const seedDocumentsRef = useRef(seedDocuments);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    seedDocumentsRef.current = seedDocuments;
    if (__DEV__) {
      console.log('[campaign-chat] seedDocuments', {
        campaignId,
        campaignName,
        docCount: seedDocuments.length,
        docIds: seedDocuments.map((doc) => doc.id),
      });
    }
  }, [campaignId, campaignName, seedDocuments]);

  const isReady = llm.isReady && rag.isReady;

  const statusLabel = useMemo(() => {
    if (llm.status === 'error') return llm.statusLabel;
    if (rag.status === 'error') return rag.statusLabel;
    if (!llm.isReady) return llm.statusLabel;
    if (!rag.isReady) return rag.statusLabel;
    return `Ready · ${campaignName}`;
  }, [
    llm.status,
    llm.statusLabel,
    llm.isReady,
    rag.status,
    rag.statusLabel,
    rag.isReady,
    campaignName,
  ]);

  const downloadPct = llm.downloadPct ?? rag.downloadPct;

  const sendMessage = useCallback(
    async (text: string) => {
      if (!llm.modelId || isGenerating) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      setIsGenerating(true);

      const userMsg: ChatMessage = { id: makeId(), role: 'user', content: trimmed };
      const assistantId = makeId();
      const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '' };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      try {
        if (__DEV__) {
          console.log('[campaign-chat] sendMessage', { query: trimmed, campaignName });
        }

        const ragContext = await rag.search(trimmed);
        const { context, source } = resolveChatContext(
          ragContext,
          seedDocumentsRef.current,
          trimmed,
        );

        const preparedContext = prepareChatContext(context);

        if (__DEV__) {
          console.log('[campaign-chat] context', {
            source,
            hasContext: preparedContext != null,
            contextLength: preparedContext?.length ?? 0,
            contextPreview: preparedContext?.slice(0, 200),
          });
        }

        const systemContent = buildSystemPrompt(campaignName, preparedContext);

        const recentMessages = messagesRef.current
          .filter(
            (m) =>
              m.role !== 'system' &&
              m.id !== assistantId &&
              m.content.trim() &&
              !m.content.startsWith('Error:'),
          )
          .slice(-CHAT_MAX_HISTORY_MESSAGES)
          .map((m) => ({
            role: m.role,
            content: truncateForChat(m.content, CHAT_MAX_HISTORY_MESSAGE_CHARS),
          }));

        const history = [
          { role: 'system' as const, content: systemContent },
          ...recentMessages,
          { role: 'user' as const, content: trimmed },
        ];

        const run = completion({
          modelId: llm.modelId,
          history,
          stream: true,
          generationParams: {
            predict: CHAT_MAX_PREDICT_TOKENS,
            repeat_penalty: 1.15,
          },
        });

        let acc = '';
        let stats: MessageStats | undefined;

        for await (const event of run.events) {
          if (event.type === 'contentDelta') {
            acc += event.text;
            if (acc.length >= CHAT_MAX_OUTPUT_CHARS) {
              acc = truncateForChat(acc, CHAT_MAX_OUTPUT_CHARS);
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
              );
              break;
            }
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

        auditCompletion('campaign_chat', final.stats, {
          promptChars: trimmed.length,
          ragContextChars: ragContext?.length ?? 0,
        });

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
    },
    [llm.modelId, isGenerating, rag, campaignName, campaignId],
  );

  return {
    messages,
    sendMessage,
    isGenerating,
    isReady,
    statusLabel,
    downloadPct,
  };
}
