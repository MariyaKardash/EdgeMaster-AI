import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useCallback, useState } from 'react';

import { completion } from '@qvac/sdk';

import type { DictationState } from '@/components/organisms/description-editor';
import { useCampaign } from '@/contexts/campaign-context';
import type { ChapterInputTab, DocState } from '@/screens/master/new-chapter/new-chapter.types';
import {
  buildGenerateSystemPrompt,
  FIX_SYSTEM_PROMPT,
  MAX_FILE_BYTES,
  SUPPORTED_MIME_TYPES,
} from '@/screens/master/new-chapter/new-chapter.constants';
import {
  buildGenerationSource,
  isSupportedExtension,
} from '@/screens/master/new-chapter/new-chapter.utils';

import { useLLMModel } from './useLLMModel';
import { useTranscription } from './useTranscription';
import { syncChapterDescriptionToRAG } from '@/services/campaign-rag';
import type { DocSource } from '@/types/campaign.types';

export type UseNewChapterParams = {
  campaignId: string;
};

export type UseNewChapterResult = {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  activeTab: ChapterInputTab;
  setActiveTab: (tab: ChapterInputTab) => void;
  promptText: string;
  setPromptText: (v: string) => void;

  dictationState: DictationState;
  onDictationPress: () => void;

  docState: DocState;
  handleDocPick: () => Promise<void>;

  isFixing: boolean;
  isGenerating: boolean;
  isModelReady: boolean;
  modelStatusLabel: string;
  downloadPct: number | null;

  handleFix: () => Promise<void>;
  handleGenerate: () => Promise<void>;
  handleSave: () => Promise<void>;
  isSaving: boolean;

  errorMessage: string | null;
  clearError: () => void;

  canSave: boolean;
};

export function useNewChapter({ campaignId }: UseNewChapterParams): UseNewChapterResult {
  const llm = useLLMModel();
  const { listChapters, createChapter } = useCampaign();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const transcription = useTranscription({
    onError: (msg) => setErrorMessage(msg),
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<ChapterInputTab>('manual');
  const [promptText, setPromptText] = useState('');
  const [docState, setDocState] = useState<DocState>('idle');
  const [isFixing, setIsFixing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDescriptionChange = useCallback((v: string) => {
    setDescription(v);
    setErrorMessage(null);
  }, []);

  const handleTabChange = useCallback((tab: ChapterInputTab) => {
    setActiveTab(tab);
    setErrorMessage(null);
  }, []);

  const onDictationPress = useCallback(async () => {
    if (transcription.dictationState === 'idle') {
      await transcription.startRecording();
    } else if (transcription.dictationState === 'recording') {
      const text = await transcription.stopAndTranscribe();
      if (text) {
        setDescription((prev) => (prev.trim() ? `${prev}\n${text}` : text));
      }
    }
  }, [transcription]);

  const runCompletion = useCallback(
    async (systemPrompt: string, userContent: string): Promise<string> => {
      if (!llm.modelId) throw new Error('LLM model not ready');

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
    if (!description.trim() || !llm.modelId || isFixing) return;
    setIsFixing(true);
    setErrorMessage(null);
    try {
      const fixed = await runCompletion(FIX_SYSTEM_PROMPT, description);
      if (fixed) setDescription(fixed);
    } catch (e: unknown) {
      console.error('[useNewChapter] handleFix failed:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Fix failed. Please try again.');
    } finally {
      setIsFixing(false);
    }
  }, [description, llm.modelId, isFixing, runCompletion]);

  const handleGenerate = useCallback(async () => {
    if (!promptText.trim() || !llm.modelId || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const allChapters = await listChapters(campaignId).catch(() => []);
      const priorChapters = allChapters.slice(-2).map((c) => ({
        title: c.title,
        description: c.description,
      }));
      const systemPrompt = buildGenerateSystemPrompt(priorChapters);
      const generated = await runCompletion(systemPrompt, promptText);
      if (generated) setDescription(generated);
    } catch (e: unknown) {
      console.error('[useNewChapter] handleGenerate failed:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [promptText, llm.modelId, isGenerating, listChapters, campaignId, runCompletion]);

  const handleDocPick = useCallback(async () => {
    setErrorMessage(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_MIME_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];

      if (!isSupportedExtension(asset.name)) {
        setErrorMessage('Unsupported file format. Use .txt or .md files.');
        return;
      }

      if (asset.size != null && asset.size > MAX_FILE_BYTES) {
        setErrorMessage('File is too large. Maximum size is 1 MB.');
        return;
      }

      setDocState('processing');
      const content = await new File(asset.uri).text();

      setDescription(content.trim());
    } catch (e: unknown) {
      console.error('[useNewChapter] handleDocPick failed:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Could not read file.');
    } finally {
      setDocState('idle');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const existingChapters = await listChapters(campaignId).catch(() => []);
      const order = existingChapters.length;
      const generationSource = buildGenerationSource(activeTab);
      const chapter = await createChapter({
        campaignId,
        title: title.trim(),
        description: description.trim(),
        order,
        generationSource,
      });

      const ragSource: DocSource =
        generationSource.type === 'ai_generated' ? 'ai-generated' : 'master-written';

      void syncChapterDescriptionToRAG(
        campaignId,
        chapter.id,
        chapter.title,
        chapter.description,
        ragSource,
      );
    } catch (e) {
      console.error('[useNewChapter] handleSave failed:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Failed to save chapter.');
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
  }, [isSaving, listChapters, campaignId, activeTab, createChapter, title, description]);

  return {
    title,
    setTitle,
    description,
    setDescription: handleDescriptionChange,
    activeTab,
    setActiveTab: handleTabChange,
    promptText,
    setPromptText,

    dictationState: transcription.dictationState,
    onDictationPress,

    docState,
    handleDocPick,

    isFixing,
    isGenerating,
    isModelReady: llm.isReady,
    modelStatusLabel: llm.statusLabel,
    downloadPct: llm.downloadPct,

    handleFix,
    handleGenerate,
    handleSave,
    isSaving,

    errorMessage,
    clearError: () => setErrorMessage(null),

    canSave: title.trim().length > 0 && description.trim().length > 0 && !isSaving,
  };
}
