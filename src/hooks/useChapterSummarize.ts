import {
  completion,
  downloadAsset,
  LLAMA_3_2_1B_INST_Q4_0,
  loadModel,
  unloadModel,
  VERBOSITY,
  type ModelProgressUpdate,
} from '@qvac/sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter, GameEvent } from '@/database';
import { FIX_SYSTEM_PROMPT } from '@/screens/master/new-chapter/new-chapter.constants';
import { useTranscription } from './useTranscription';

export type ChapterSummarizeModelStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'error';

export type UseChapterSummarizeResult = {
  chapter: Chapter | null;
  hasEvents: boolean;
  isLoadingData: boolean;
  summaryText: string;
  setSummaryText: (text: string) => void;
  modelStatus: ChapterSummarizeModelStatus;
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

function buildSummaryPrompt(chapter: Chapter, events: GameEvent[]): string {
  const hasEvents = events.length > 0;

  const eventLines = hasEvents
    ? events
        .map((e, i) => `${i + 1}. [${e.type.toUpperCase()}] ${e.title}: ${e.body}`.trim())
        .join('\n')
    : null;

  const contextNote = hasEvents
    ? `Use the chapter background only for context (names, setting, tone). ` +
      `The summary must be driven by the events — they represent what actually happened at the table.`
    : `No events were recorded during this chapter. ` +
      `Write a brief summary based solely on the chapter background below.`;

  return (
    `You are a chronicler for a tabletop RPG campaign. ` +
    `Write a vivid narrative summary in 2–3 paragraphs of plain prose. ` +
    `Use past tense. Do NOT start with a title, chapter label, or heading of any kind. ` +
    `Do NOT use bullet points. Begin directly with the narrative.\n\n` +
    `${contextNote}\n\n` +
    `Chapter title: ${chapter.title}\n` +
    `Chapter background: ${chapter.description}\n\n` +
    (eventLines ? `Events that took place:\n${eventLines}\n\n` : '') +
    `Summary:`
  );
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

  const [modelStatus, setModelStatus] = useState<ChapterSummarizeModelStatus>('idle');
  const [modelStatusLabel, setModelStatusLabel] = useState('');
  const [downloadPct, setDownloadPct] = useState<number | null>(null);
  const modelIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

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

  // Download + load model on mount
  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        setModelStatus('downloading');
        setModelStatusLabel('Downloading AI model…');

        await downloadAsset({
          assetSrc: LLAMA_3_2_1B_INST_Q4_0,
          onProgress: (p: ModelProgressUpdate) => {
            if (mountedRef.current) setDownloadPct(Math.round(p.percentage));
          },
        });

        if (!mountedRef.current) return;

        setModelStatus('loading');
        setModelStatusLabel('Loading AI model…');
        setDownloadPct(null);

        const id = await loadModel({
          modelSrc: LLAMA_3_2_1B_INST_Q4_0,
          modelType: 'llamacpp-completion',
          modelConfig: {
            device: 'gpu',
            ctx_size: 2048,
            verbosity: VERBOSITY.ERROR,
          },
          onProgress: (p: ModelProgressUpdate) => {
            if (mountedRef.current) setDownloadPct(Math.round(p.percentage));
          },
        });

        if (!mountedRef.current) return;

        modelIdRef.current = id;
        setModelStatus('ready');
        setModelStatusLabel('AI ready');
        setDownloadPct(null);
      } catch (e) {
        if (mountedRef.current) {
          setModelStatus('error');
          setModelStatusLabel(e instanceof Error ? e.message : 'Failed to load AI model.');
        }
      }
    })();

    return () => {
      mountedRef.current = false;
      if (modelIdRef.current) {
        void unloadModel({ modelId: modelIdRef.current, clearStorage: false }).catch(() => {});
        modelIdRef.current = null;
      }
    };
  }, []);

  // Auto-generate as soon as model is ready and data is loaded — only if events exist
  useEffect(() => {
    if (
      modelStatus !== 'ready' ||
      isLoadingData ||
      !chapterRef.current ||
      eventsRef.current.length === 0 || // skip if no events — DM must write manually
      hasTriggeredRef.current
    ) {
      return;
    }

    hasTriggeredRef.current = true;
    const modelId = modelIdRef.current;
    if (!modelId) return;

    const run = async () => {
      setIsGenerating(true);
      setErrorMessage(null);
      setSummaryText('');

      try {
        const prompt = buildSummaryPrompt(chapterRef.current!, eventsRef.current);

        const genRun = completion({
          modelId,
          history: [{ role: 'user', content: prompt }],
          stream: true,
        });

        let acc = '';
        for await (const event of genRun.events) {
          if (event.type === 'contentDelta') {
            acc += event.text;
            if (mountedRef.current) setSummaryText(acc);
          }
        }
      } catch (e) {
        if (mountedRef.current) {
          setErrorMessage(e instanceof Error ? e.message : 'Generation failed.');
        }
      } finally {
        if (mountedRef.current) setIsGenerating(false);
      }
    };

    void run();
  }, [modelStatus, isLoadingData]);

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
    const modelId = modelIdRef.current;
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
  }, [summaryText, isFixing]);

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
    modelStatus,
    modelStatusLabel,
    downloadPct,
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
