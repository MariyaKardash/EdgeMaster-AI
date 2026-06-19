import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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
import { consumeEquipHeroPlayerUpdate } from '@/screens/master/equip-hero';
import { PARTY_STATUS_SCREEN_TITLE } from './party-status.constants';
import { styles } from './party-status.styles';
import type { PartyStatusScreenProps } from './party-status.types';

type LocalPlayerEdits = Pick<PartyPlayer, 'hp' | 'stats' | 'equippedItems'>;

function applyLocalEdits(
  sourcePlayers: PartyPlayer[],
  localEditsById: Record<string, LocalPlayerEdits>,
) {
  return sourcePlayers.map((sourcePlayer) => {
    const localEdits = localEditsById[sourcePlayer.id];

    if (!localEdits) {
      return sourcePlayer;
    }

    return {
      ...sourcePlayer,
      ...localEdits,
    };
  });
}

export const PartyStatusScreen = ({
  players: sourcePlayers = [],
  onPlayersChange,
  onEquipHero,
  onTabPress,
}: PartyStatusScreenProps) => {
  const insets = useSafeAreaInsets();
  const [localEditsById, setLocalEditsById] = useState<Record<string, LocalPlayerEdits>>({});
  const bottomPadding = getSessionDashboardBottomNavHeight(insets.bottom) + 24;

  const players = useMemo(
    () => applyLocalEdits(sourcePlayers, localEditsById),
    [localEditsById, sourcePlayers],
  );

  const updateLocalPlayer = useCallback(
    (updatedPlayer: PartyPlayer) => {
      const localEdits: LocalPlayerEdits = {
        hp: updatedPlayer.hp,
        stats: updatedPlayer.stats,
        equippedItems: updatedPlayer.equippedItems,
      };

      setLocalEditsById((current) => {
        const nextEdits = {
          ...current,
          [updatedPlayer.id]: localEdits,
        };

        onPlayersChange?.(applyLocalEdits(sourcePlayers, nextEdits));
        return nextEdits;
      });
    },
    [onPlayersChange, sourcePlayers],
  );

  const handlePlayerChange = (updatedPlayer: PartyPlayer) => {
    updateLocalPlayer(updatedPlayer);
  };

  useFocusEffect(
    useCallback(() => {
      const updatedPlayer = consumeEquipHeroPlayerUpdate();

      if (!updatedPlayer) {
        return;
      }

      updateLocalPlayer(updatedPlayer);
    }, [updateLocalPlayer]),
  );

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
