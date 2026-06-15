import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ActiveChapterCard,
  ConnectedPlayerAvatar,
  Icon,
  SessionDashboardBottomNav,
  SessionIdBar,
  Text,
} from '@/components';
import {
  ACTIVE_CHAPTER_DESCRIPTION,
  ACTIVE_CHAPTER_IMAGE_URI,
  ACTIVE_CHAPTER_SECTION_TITLE,
  ACTIVE_CHAPTER_TITLE,
  BRAND_TITLE,
  CONNECTED_PLAYERS_SECTION_TITLE,
  getActivePlayersLabel,
  MOCK_CONNECTED_PLAYERS,
  MOCK_SESSION_ID,
} from './session-dashboard.constants';
import { styles } from './session-dashboard.styles';
import type { SessionDashboardScreenProps } from './session-dashboard.types';

export const SessionDashboardScreen = ({
  sessionId = MOCK_SESSION_ID,
  activeChapterTitle = ACTIVE_CHAPTER_TITLE,
  activeChapterDescription = ACTIVE_CHAPTER_DESCRIPTION,
  activeChapterImageUri = ACTIVE_CHAPTER_IMAGE_URI,
  connectedPlayers = MOCK_CONNECTED_PLAYERS,
  onOpenChapter,
  onPlayerPress,
  onTabPress,
}: SessionDashboardScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Icon name="auto-awesome" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.brandTitle}>
              {BRAND_TITLE}
            </Text>
          </View>
        </View>

        <SessionIdBar sessionId={sessionId} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Icon name="auto-stories" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.sectionTitle}>
              {ACTIVE_CHAPTER_SECTION_TITLE}
            </Text>
          </View>

          <ActiveChapterCard
            title={activeChapterTitle}
            description={activeChapterDescription}
            imageUri={activeChapterImageUri}
            onOpenChapter={onOpenChapter}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="groups" size={24} color="primary" />
              <Text variant="headlineMd" style={styles.sectionTitle}>
                {CONNECTED_PLAYERS_SECTION_TITLE}
              </Text>
            </View>
            <Text variant="labelMd" style={styles.activeCount}>
              {getActivePlayersLabel(connectedPlayers.length)}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playersRow}
          >
            {connectedPlayers.map((player) => (
              <ConnectedPlayerAvatar
                key={player.id}
                player={player}
                onPress={() => onPlayerPress?.(player)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <SessionDashboardBottomNav onTabPress={onTabPress} />
    </View>
  );
};
