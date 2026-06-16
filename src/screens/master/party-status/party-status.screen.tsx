import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getSessionDashboardBottomNavHeight,
  Icon,
  PartyPlayerCard,
  SessionDashboardBottomNav,
  Text,
} from '@/components';
import type { PartyPlayer } from '@/components/molecules/party-player-card';
import { MOCK_PARTY_PLAYERS, PARTY_STATUS_SCREEN_TITLE } from './party-status.constants';
import { styles } from './party-status.styles';
import type { PartyStatusScreenProps } from './party-status.types';

export const PartyStatusScreen = ({
  players: initialPlayers = MOCK_PARTY_PLAYERS,
  onPlayersChange,
  onEquipHero,
  onTabPress,
}: PartyStatusScreenProps) => {
  const insets = useSafeAreaInsets();
  const [players, setPlayers] = useState(initialPlayers);
  const bottomPadding = getSessionDashboardBottomNavHeight(insets.bottom) + 24;

  const handlePlayerChange = (updatedPlayer: PartyPlayer) => {
    setPlayers((current) => {
      const nextPlayers = current.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player,
      );
      onPlayersChange?.(nextPlayers);
      return nextPlayers;
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} style={{ paddingTop: insets.top }}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Icon name="auto-awesome" size={24} color="primary" />
            <Text variant="headlineMd" style={styles.brandTitle}>
              {PARTY_STATUS_SCREEN_TITLE}
            </Text>
          </View>
        </View>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1, paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <Pressable onPress={Keyboard.dismiss} style={styles.dismissPressable}>
          <View style={styles.playersList}>
            {players.map((player) => (
              <PartyPlayerCard
                key={player.id}
                player={player}
                onPlayerChange={handlePlayerChange}
                onEquipHero={onEquipHero}
              />
            ))}
          </View>
        </Pressable>
      </ScrollView>

      <SessionDashboardBottomNav activeTab="players" onTabPress={onTabPress} />
    </View>
  );
};
