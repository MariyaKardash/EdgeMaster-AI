import { completion } from '@qvac/sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter, GameEvent } from '@/database';
import { FIX_SYSTEM_PROMPT } from '@/screens/master/new-chapter/new-chapter.constants';
import { useLLMModel, type LLMModelStatus } from './useLLMModel';
import { useTranscription } from './useTranscription';

export type UseChapterSummarizeResult = {
  chapter: Chapter | null;
  hasEvents: boolean;
  isLoadingData: boolean;
  summaryText: string;
  setSummaryText: (text: string) => void;
  modelStatus: LLMModelStatus;
  modelStatusLabel: string;
  downloadPct: number | null;
  isGenerating: boolean;
  isFixing: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  dictationState: ReturnType<typeof useTranscription>['dictationState'];
  onDictationPress: () => void;
  handleFix: () => Promise<void>;
  save: () => Promise<void>;
};

type Params = {
  chapterId: string;
  onSaved: () => void;
};

type SummaryPrompt = {
  systemContent: string;
  userContent: string;
};

function buildSummaryPrompt(chapter: Chapter, events: GameEvent[]): SummaryPrompt {
  const hasEvents = events.length > 0;

  const eventLines = hasEvents
    ? events
        .map((e, i) => `${i + 1}. [${e.type.toUpperCase()}] ${e.title}: ${e.body}`.trim())
        .join('\n')
    : null;

  const contextNote = hasEvents
    ? `Use the chapter background only for context (names, setting, tone). ` +
      `The summary must be driven by the events — they represent what actually happened at the table.`
    : `Use the chapter background below as the sole source.`;

  const systemContent =
    `You are a chronicler for a tabletop RPG campaign. ` +
    `Write a vivid narrative summary in 2–3 paragraphs of plain prose. ` +
    `Use past tense. Output plain prose only — no titles, no headings, no bold labels, ` +
    `no markdown formatting of any kind, no bullet points. ` +
    `Begin directly with the first sentence of the narrative.`;

  const userContent =
    `${contextNote}\n\n` +
    `Chapter title: ${chapter.title}\n` +
    `Chapter background: ${chapter.description}\n\n` +
    (eventLines ? `Events that took place:\n${eventLines}` : '');

  return { systemContent, userContent };
}

export function useChapterSummarize({ chapterId, onSaved }: Params): UseChapterSummarizeResult {
  const { getChapter, listGameEvents, summarizeChapter } = useCampaign();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [hasEvents, setHasEvents] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [summaryText, setSummaryText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const transcription = useTranscription({
    onError: (msg) => setErrorMessage(msg),
  });

  const llm = useLLMModel({ ctxSize: 2048 });

  // mountedRef guards async state updates in generate / fix / save after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Keep refs so the auto-generate effect always sees fresh values
  const chapterRef = useRef<Chapter | null>(null);
  const eventsRef = useRef<GameEvent[]>([]);
  const hasTriggeredRef = useRef(false);

  // Load chapter + events
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoadingData(true);
      setErrorMessage(null);
      try {
        const [loadedChapter, loadedEvents] = await Promise.all([
          getChapter(chapterId),
          listGameEvents(chapterId),
        ]);
        if (!cancelled) {
          chapterRef.current = loadedChapter;
          eventsRef.current = loadedEvents;
          setChapter(loadedChapter);
          setHasEvents(loadedEvents.length > 0);
        }
      } catch (e) {
        if (!cancelled) {
          setErrorMessage(e instanceof Error ? e.message : 'Failed to load chapter data.');
        }
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [chapterId, getChapter, listGameEvents]);

  // Auto-generate as soon as model is ready and data is loaded — only if events exist
  useEffect(() => {
    if (
      !llm.isReady ||
      isLoadingData ||
      !chapterRef.current ||
      eventsRef.current.length === 0 || // skip if no events — DM must write manually
      hasTriggeredRef.current
    ) {
      return;
    }

    hasTriggeredRef.current = true;
    const modelId = llm.modelId;
    if (!modelId) return;

    const run = async () => {
      setIsGenerating(true);
      setErrorMessage(null);
      setSummaryText('');

      try {
        const { systemContent, userContent } = buildSummaryPrompt(
          chapterRef.current!,
          eventsRef.current,
        );

        const genRun = completion({
          modelId,
          history: [
            { role: 'system', content: systemContent },
            { role: 'user', content: userContent },
            // Prefill forces the model to continue mid-sentence, preventing a title as the first token
            { role: 'assistant', content: 'The' },
          ],
          stream: true,
        });

        let acc = 'The';
        for await (const event of genRun.events) {
          if (event.type === 'contentDelta') {
            acc += event.text;
            if (mountedRef.current) setSummaryText(acc);
          }
        }

        // Strip any leading bold/heading line the model may still have produced
        const cleaned = acc.replace(/^\*{1,3}[^*\n]+\*{1,3}\n?/, '').trimStart();
        if (cleaned !== acc && mountedRef.current) setSummaryText(cleaned);
      } catch (e) {
        if (mountedRef.current) {
          setErrorMessage(e instanceof Error ? e.message : 'Generation failed.');
        }
      } finally {
        if (mountedRef.current) setIsGenerating(false);
      }
    };

    void run();
  }, [llm.isReady, llm.modelId, isLoadingData]);

  const onDictationPress = useCallback(async () => {
    if (transcription.dictationState === 'recording') {
      const text = await transcription.stopAndTranscribe();
      if (text) {
        setSummaryText((prev) => (prev.trim() ? `${prev}\n${text}` : text));
      }
    } else {
      await transcription.startRecording();
    }
  }, [transcription]);

  const handleFix = useCallback(async () => {
    const modelId = llm.modelId;
    if (!summaryText.trim() || !modelId || isFixing) return;

    setIsFixing(true);
    setErrorMessage(null);
    try {
      const run = completion({
        modelId,
        history: [
          { role: 'system', content: FIX_SYSTEM_PROMPT },
          { role: 'user', content: summaryText },
        ],
        stream: true,
      });

      let result = '';
      for await (const event of run.events) {
        if (event.type === 'contentDelta') result += event.text;
      }
      if (result.trim() && mountedRef.current) setSummaryText(result.trim());
    } catch (e) {
      if (mountedRef.current) {
        setErrorMessage(e instanceof Error ? e.message : 'Format failed.');
      }
    } finally {
      if (mountedRef.current) setIsFixing(false);
    }
  }, [summaryText, isFixing, llm.modelId]);

  const save = useCallback(async () => {
    if (!summaryText.trim() || isSaving) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await summarizeChapter(chapterId, summaryText.trim());
      onSaved();
    } catch (e) {
      if (mountedRef.current) {
        setErrorMessage(e instanceof Error ? e.message : 'Failed to save summary.');
      }
    } finally {
      if (mountedRef.current) setIsSaving(false);
    }
  }, [summaryText, isSaving, summarizeChapter, chapterId, onSaved]);

  return {
    chapter,
    hasEvents,
    isLoadingData,
    summaryText,
    setSummaryText,
    modelStatus: llm.status,
    modelStatusLabel: llm.statusLabel,
    downloadPct: llm.downloadPct,
    isGenerating,
    isFixing,
    isSaving,
    errorMessage,
    dictationState: transcription.dictationState,
    onDictationPress,
    handleFix,
    save,
  };
}
