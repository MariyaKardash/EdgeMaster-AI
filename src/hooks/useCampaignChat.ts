import { completion } from '@qvac/sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CampaignDoc } from '@/types/campaign.types';
import type { ChatMessage, MessageStats } from '@/screens/llm-chat/llm-chat.types';

import { auditCompletion } from '@/lib/qvac-audit';

import { useCampaignRAG } from './useCampaignRAG';
import { useLLMModel } from './useLLMModel';

/** Max chat messages kept in the history sent to the LLM (not in the UI).
 *  Limits KV cache growth. 10 = 5 back-and-forth exchanges. */
const MAX_HISTORY_MESSAGES = 10;

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
      `Tell the user clearly that this topic isn't covered in the current campaign notes.`
    );
  }

  return (
    base +
    ` Answer concisely and accurately based on the campaign context below. ` +
    `If the answer is not covered by the context, say so honestly.\n\nCampaign context:\n${context}`
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
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
        const ragContext = await rag.search(trimmed);

        const systemContent = buildSystemPrompt(campaignName, ragContext);

        const recentMessages = messagesRef.current
          .filter((m) => m.role !== 'system')
          .slice(-MAX_HISTORY_MESSAGES)
          .map((m) => ({ role: m.role, content: m.content }));

        const history = [
          { role: 'system' as const, content: systemContent },
          ...recentMessages,
          { role: 'user' as const, content: trimmed },
        ];

        const run = completion({
          modelId: llm.modelId,
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
    [llm.modelId, isGenerating, rag, campaignName],
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
