import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/molecules/button';
import { ButtonSecondary } from '@/components/molecules/button-secondary';
import { useChapterDetail } from '@/hooks/useChapterDetail';

import { STATUS_LABELS } from './chapter-detail.constants';
import { styles } from './chapter-detail.styles';
import type { ChapterDetailScreenProps } from './chapter-detail.types';
import {
  canComplete,
  canDelete,
  canStart,
  formatChapterDate,
  getGenerationSourceLabel,
} from './chapter-detail.utils';

export function ChapterDetailScreen({
  chapterId,
  campaignId,
  onBack,
  onCompleteTapped,
}: ChapterDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const {
    chapter,
    isLoading,
    isActivating,
    isDeleting,
    errorMessage,
    handleStart,
    handleComplete,
    handleDelete,
  } = useChapterDetail({
    chapterId,
    campaignId,
    onDeleted: onBack,
    onCompleteTapped,
  });

  const status = chapter?.status;

  const statusBadgeStyle =
    status === 'active'
      ? styles.statusBadgeActive
      : status === 'completed'
        ? styles.statusBadgeCompleted
        : styles.statusBadgeDraft;

  const statusBadgeTextStyle =
    status === 'active'
      ? styles.statusBadgeTextActive
      : status === 'completed'
        ? styles.statusBadgeTextCompleted
        : styles.statusBadgeTextDraft;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" color="primary" size={24} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {isLoading ? 'Loading…' : (chapter?.title ?? 'Chapter')}
        </Text>
      </View>

      {/* Loading state */}
      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {/* Content */}
      {!isLoading && chapter && (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + theme.spacing.xl },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Meta row: status badge + date */}
            <View style={styles.metaRow}>
              <View style={[styles.statusBadge, statusBadgeStyle]}>
                <Text style={statusBadgeTextStyle}>{STATUS_LABELS[chapter.status]}</Text>
              </View>
              <Text style={styles.metaLabel}>{formatChapterDate(chapter.createdAt)}</Text>
              {chapter.generationSource && (
                <Text style={styles.metaLabel}>· {getGenerationSourceLabel(chapter)}</Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionBody}>{chapter.description}</Text>
              </View>
            </View>

            {/* Summary — only for completed chapters */}
            {chapter.status === 'completed' && (
              <View style={styles.section}>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Summary</Text>
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionBody}>
                    {chapter.summary?.trim() ? chapter.summary : 'No summary added yet.'}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom action strip */}
          <View style={{ backgroundColor: theme.colors.background }}>
            {errorMessage && (
              <View
                style={{
                  paddingHorizontal: theme.spacing.containerMargin,
                  paddingTop: theme.spacing.sm,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.error,
                    fontFamily: theme.textStyles.bodyMd.fontFamily,
                    fontSize: theme.textStyles.bodyMd.fontSize,
                  }}
                >
                  {errorMessage}
                </Text>
              </View>
            )}
            <View style={[styles.bottomStrip, { paddingBottom: insets.bottom + theme.spacing.md }]}>
              {/* Delete — disabled while chapter is active */}
              <Pressable
                style={[
                  styles.deleteButton,
                  (!canDelete(chapter.status) || isDeleting) && styles.deleteButtonDisabled,
                ]}
                onPress={handleDelete}
                disabled={!canDelete(chapter.status) || isDeleting}
                accessibilityLabel="Delete chapter"
              >
                {isDeleting ? (
                  <ActivityIndicator size={16} color={theme.colors.error} />
                ) : (
                  <Icon name="delete-outline" color="error" size={18} />
                )}
                <Text style={styles.deleteButtonLabel}>Delete</Text>
              </Pressable>

              {/* Primary action */}
              {canStart(chapter.status) && (
                <View style={{ flex: 1 }}>
                  <Button
                    title={isActivating ? 'Starting…' : 'Start Chapter'}
                    icon="play-arrow"
                    fullWidth
                    disabled={isActivating}
                    onPress={handleStart}
                  />
                </View>
              )}

              {canComplete(chapter.status) && (
                <View style={{ flex: 1 }}>
                  <Button
                    title="Complete Chapter"
                    icon="check-circle-outline"
                    fullWidth
                    onPress={handleComplete}
                  />
                </View>
              )}

              {chapter.status === 'completed' && (
                <View style={{ flex: 1 }}>
                  <ButtonSecondary
                    title="View Summary"
                    icon="article"
                    fullWidth
                    onPress={handleComplete}
                  />
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Error when chapter not found */}
      {!isLoading && !chapter && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.containerMargin,
          }}
        >
          <Text
            style={{
              color: theme.colors.error,
              textAlign: 'center',
              fontFamily: theme.textStyles.bodyMd.fontFamily,
            }}
          >
            {errorMessage ?? 'Chapter not found.'}
          </Text>
        </View>
      )}
    </View>
  );
}
