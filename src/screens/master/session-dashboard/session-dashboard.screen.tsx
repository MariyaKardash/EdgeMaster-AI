import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ActiveChapterCard,
  Button,
  ConnectedPlayerAvatar,
  Icon,
  SessionDashboardBottomNav,
  SessionIdBar,
  Text,
} from '@/components';
import {
  ACTIVE_CHAPTER_SECTION_TITLE,
  BRAND_TITLE,
  CONNECTED_PLAYERS_SECTION_TITLE,
  getActivePlayersLabel,
  NO_ACTIVE_CHAPTER_DESCRIPTION,
  NO_ACTIVE_CHAPTER_TITLE,
  START_SESSION_LABEL,
  STARTING_SESSION_LABEL,
  SESSION_ACTIVE_LABEL,
} from './session-dashboard.constants';
import { styles } from './session-dashboard.styles';
import type { SessionDashboardScreenProps } from './session-dashboard.types';

export const SessionDashboardScreen = ({
  campaignName,
  sessionId,
  isSessionActive = false,
  isSessionConnecting = false,
  isStartingSession = false,
  activeChapterTitle,
  activeChapterDescription,
  activeChapterImageUri,
  connectedPlayers = [],
  connectedPeerCount = 0,
  onStartSession,
  onOpenChapter,
  onPlayerPress,
  onTabPress,
}: SessionDashboardScreenProps) => {
  const chapterTitle = activeChapterTitle ?? NO_ACTIVE_CHAPTER_TITLE;
  const chapterDescription = activeChapterDescription ?? NO_ACTIVE_CHAPTER_DESCRIPTION;
  const hasActiveChapter = Boolean(activeChapterTitle);
  const insets = useSafeAreaInsets();
  const isStartDisabled = isStartingSession || isSessionConnecting || isSessionActive;
  const startSessionLabel =
    isStartingSession || isSessionConnecting
      ? STARTING_SESSION_LABEL
      : isSessionActive
        ? SESSION_ACTIVE_LABEL
        : START_SESSION_LABEL;

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Icon name="castle" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.brandTitle}>
              {campaignName ?? BRAND_TITLE}
            </Text>
          </View>
        </View>

        <View style={styles.sessionHeader}>
          {sessionId ? <SessionIdBar sessionId={sessionId} /> : null}
          {onStartSession ? (
            <View style={styles.startSessionButton}>
              <Button
                title={startSessionLabel}
                icon={isSessionActive ? 'check-circle' : 'play-arrow'}
                fullWidth
                disabled={isStartDisabled}
                onPress={onStartSession}
              />
            </View>
          ) : null}
        </View>
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
            title={chapterTitle}
            description={chapterDescription}
            imageUri={hasActiveChapter ? activeChapterImageUri : undefined}
            onOpenChapter={hasActiveChapter ? onOpenChapter : undefined}
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
              {getActivePlayersLabel(connectedPeerCount)}
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
