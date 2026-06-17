import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useCampaign } from '@/contexts/campaign-context';
import type { Chapter } from '@/database/entities';
import {
  ACTIVATE_BLOCKED_TITLE,
  DELETE_CONFIRM_BUTTON,
  DELETE_CONFIRM_MESSAGE,
  DELETE_CONFIRM_TITLE,
} from '@/screens/master/chapter-detail/chapter-detail.constants';

export type UseChapterDetailResult = {
  chapter: Chapter | null;
  isLoading: boolean;
  isActivating: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  handleStart: () => void;
  handleComplete: () => void;
  handleDelete: () => void;
};

type UseChapterDetailParams = {
  chapterId: string;
  campaignId: string;
  onDeleted: () => void;
  onStarted: () => void;
  onCompleteTapped: (chapterId: string) => void;
};

export function useChapterDetail({
  chapterId,
  campaignId,
  onDeleted,
  onStarted,
  onCompleteTapped,
}: UseChapterDetailParams): UseChapterDetailResult {
  const { getChapter, activateChapter, deleteChapter } = useCampaign();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await getChapter(chapterId);
        if (!cancelled) setChapter(result);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Failed to load chapter.';
          console.error('[useChapterDetail] load failed:', e);
          setErrorMessage(msg);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [chapterId, getChapter]);

  const handleStart = useCallback(async () => {
    if (isActivating) return;
    setIsActivating(true);
    setErrorMessage(null);
    try {
      const updated = await activateChapter(campaignId, chapterId);
      setChapter(updated);
      onStarted();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not start chapter.';
      console.error('[useChapterDetail] activateChapter failed:', e);
      Alert.alert(ACTIVATE_BLOCKED_TITLE, msg, [{ text: 'OK' }]);
    } finally {
      setIsActivating(false);
    }
  }, [isActivating, activateChapter, campaignId, chapterId, onStarted]);

  const handleComplete = useCallback(() => {
    onCompleteTapped(chapterId);
  }, [onCompleteTapped, chapterId]);

  const handleDelete = useCallback(() => {
    Alert.alert(DELETE_CONFIRM_TITLE, DELETE_CONFIRM_MESSAGE, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: DELETE_CONFIRM_BUTTON,
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          setErrorMessage(null);
          try {
            await deleteChapter(campaignId, chapterId);
            onDeleted();
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Could not delete chapter.';
            console.error('[useChapterDetail] deleteChapter failed:', e);
            setErrorMessage(msg);
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  }, [deleteChapter, campaignId, chapterId, onDeleted]);

  return {
    chapter,
    isLoading,
    isActivating,
    isDeleting,
    errorMessage,
    handleStart,
    handleComplete,
    handleDelete,
  };
}
