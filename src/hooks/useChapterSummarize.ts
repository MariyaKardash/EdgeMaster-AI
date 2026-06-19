import { useCallback, useEffect, useRef, useState } from 'react';

import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter } from '@/database';
import { CHAPTER_SUMMARY_CTX_SIZE } from '@/screens/master/chapter-summarize/chapter-summarize.prompts';
import {
  fixChapterSummary,
  generateChapterSummary,
} from '@/screens/master/chapter-summarize/chapter-summarize.utils';
import { useLLMModel, type LLMModelStatus } from './useLLMModel';
import { useTranscription } from './useTranscription';
import { syncChapterSummaryToRAG } from '@/services/campaign-rag';

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

  const llm = useLLMModel({ ctxSize: CHAPTER_SUMMARY_CTX_SIZE });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const chapterRef = useRef<Chapter | null>(null);
  const eventsRef = useRef<Awaited<ReturnType<typeof listGameEvents>>>([]);
  const hasTriggeredRef = useRef(false);

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

  useEffect(() => {
    if (
      !llm.isReady ||
      isLoadingData ||
      !chapterRef.current ||
      eventsRef.current.length === 0 ||
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
        const { summary } = await generateChapterSummary({
          modelId,
          chapter: chapterRef.current!,
          events: eventsRef.current,
          onDelta: (text) => {
            if (mountedRef.current) setSummaryText(text);
          },
        });

        if (mountedRef.current) setSummaryText(summary);
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
      const fixed = await fixChapterSummary(modelId, summaryText);
      if (fixed && mountedRef.current) setSummaryText(fixed);
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
      const updatedChapter = await summarizeChapter(chapterId, summaryText.trim());

      void syncChapterSummaryToRAG(
        updatedChapter.campaignId,
        updatedChapter.id,
        updatedChapter.title,
        summaryText.trim(),
      );

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
