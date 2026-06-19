import { completion } from '@qvac/sdk';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { EventLogItemData } from '@/components/molecules/event-log-item';
import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter } from '@/database';
import { useChapterGameLog } from '@/hooks/useChapterGameLog';
import { FIX_SYSTEM_PROMPT } from '@/screens/master/new-chapter/new-chapter.constants';

import { useLLMModel } from './useLLMModel';
import { useTranscription } from './useTranscription';

export type UseLiveControlParams = {
  chapterId: string;
};

export type UseLiveControlResult = {
  chapter: Chapter | null;
  logEntries: EventLogItemData[];
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isLoading: boolean;
  isExecuting: boolean;
  isFixing: boolean;
  isModelReady: boolean;
  modelStatusLabel: string;
  downloadPct: number | null;
  errorMessage: string | null;
  dictationState: ReturnType<typeof useTranscription>['dictationState'];
  onDictationPress: () => void;
  handleFix: () => Promise<void>;
  handleExecuteEvent: () => Promise<boolean>;
};

export function useLiveControl({ chapterId }: UseLiveControlParams): UseLiveControlResult {
  const { getChapter, createGameEvent } = useCampaign();
  const { entries: logEntries, isLoading: isLogLoading } = useChapterGameLog(chapterId);
  const llm = useLLMModel();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingEvents = isLoading || isLogLoading;
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const transcription = useTranscription({
    onError: (msg) => setErrorMessage(msg),
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const loadedChapter = await getChapter(chapterId);
      setChapter(loadedChapter);
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, getChapter]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
    setErrorMessage(null);
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value);
    setErrorMessage(null);
  }, []);

  const onDictationPress = useCallback(async () => {
    if (transcription.dictationState === 'idle') {
      await transcription.startRecording();
      return;
    }

    if (transcription.dictationState === 'recording') {
      const text = await transcription.stopAndTranscribe();
      if (text) {
        setDescription((prev) => (prev.trim() ? `${prev}\n${text}` : text));
      }
    }
  }, [transcription]);

  const runCompletion = useCallback(
    async (systemPrompt: string, userContent: string): Promise<string> => {
      if (!llm.modelId) {
        throw new Error('LLM model not ready');
      }

      const run = completion({
        modelId: llm.modelId,
        history: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        stream: true,
      });

      let result = '';
      for await (const event of run.events) {
        if (event.type === 'contentDelta') {
          result += event.text;
        }
      }
      return result.trim();
    },
    [llm.modelId],
  );

  const handleFix = useCallback(async () => {
    if (!description.trim() || !llm.modelId || isFixing) {
      return;
    }

    setIsFixing(true);
    setErrorMessage(null);

    try {
      const fixed = await runCompletion(FIX_SYSTEM_PROMPT, description);
      if (fixed) {
        setDescription(fixed);
      }
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'Format failed. Please try again.');
    } finally {
      setIsFixing(false);
    }
  }, [description, isFixing, llm.modelId, runCompletion]);

  const handleExecuteEvent = useCallback(async (): Promise<boolean> => {
    const eventTitle = title.trim();
    const body = description.trim();
    if (!eventTitle || !body || isExecuting) {
      return false;
    }

    setIsExecuting(true);
    setErrorMessage(null);

    try {
      await createGameEvent({
        chapterId,
        type: 'event',
        title: eventTitle,
        body,
      });
      setTitle('');
      setDescription('');
      return true;
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'Failed to save event.');
      return false;
    } finally {
      setIsExecuting(false);
    }
  }, [chapterId, createGameEvent, description, isExecuting, title]);

  return {
    chapter,
    logEntries,
    title,
    setTitle: handleTitleChange,
    description,
    setDescription: handleDescriptionChange,
    isLoading: isLoadingEvents,
    isExecuting,
    isFixing,
    isModelReady: llm.isReady,
    modelStatusLabel: llm.statusLabel,
    downloadPct: llm.downloadPct,
    errorMessage,
    dictationState: transcription.dictationState,
    onDictationPress,
    handleFix,
    handleExecuteEvent,
  };
}
