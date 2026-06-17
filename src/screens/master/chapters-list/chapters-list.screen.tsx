import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ChapterListItemCard,
  FAB_OFFSET_ABOVE_TAB_BAR,
  FloatingActionButton,
  getSessionDashboardBottomNavHeight,
  Icon,
  SessionDashboardBottomNav,
  Text,
} from '@/components';
import {
  CHAPTERS_SCREEN_TITLE,
  EMPTY_CHAPTERS_DESCRIPTION,
  EMPTY_CHAPTERS_TITLE,
  MOCK_CHAPTERS,
} from './chapters-list.constants';
import { styles } from './chapters-list.styles';
import type { ChaptersListScreenProps } from './chapters-list.types';

export const ChaptersListScreen = ({
  chapters = [],
  onChapterPress,
  onNewChapter,
  onTabPress,
}: ChaptersListScreenProps) => {
  const insets = useSafeAreaInsets();
  const hasChapters = chapters.length > 0;
  const fabBottom = getSessionDashboardBottomNavHeight(insets.bottom) + FAB_OFFSET_ABOVE_TAB_BAR;

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Icon name="auto-awesome" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.brandTitle}>
              {CHAPTERS_SCREEN_TITLE}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: fabBottom + 56 }]}
        showsVerticalScrollIndicator={false}
      >
        {hasChapters ? (
          <View style={styles.chaptersList}>
            {chapters.map((chapter) => (
              <ChapterListItemCard
                key={chapter.id}
                title={chapter.title}
                description={chapter.description}
                status={chapter.status}
                dateLabel={chapter.dateLabel}
                onPress={() => onChapterPress?.(chapter)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="auto-stories" size={64} color="primary" />
            </View>
            <View style={styles.emptyTextBlock}>
              <Text variant="headlineMd" style={styles.emptyTitle}>
                {EMPTY_CHAPTERS_TITLE}
              </Text>
              <Text variant="bodyMd" style={styles.emptyDescription}>
                {EMPTY_CHAPTERS_DESCRIPTION}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <FloatingActionButton bottom={fabBottom} onPress={onNewChapter} />

      <SessionDashboardBottomNav activeTab="chapters" onTabPress={onTabPress} />
    </View>
  );
};
