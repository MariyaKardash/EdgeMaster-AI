import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { Button } from '@/components/molecules/button';
import { STAT_LABELS } from '@/components/molecules/character-card/character-card.constants';
import { formatStat } from '@/components/molecules/character-card/character-card.utils';
import { EditableNumberInput } from './editable-number-input.component';
import { HpEditor } from './hp-editor.component';
import { styles } from './party-player-card.styles';
import type {
  PartyPlayer,
  PartyPlayerCardProps,
  PartyPlayerStats,
} from './party-player-card.types';

const STAT_KEYS: (keyof PartyPlayerStats)[] = ['str', 'dex', 'int'];

export const PartyPlayerCard = ({
  player,
  onPlayerChange,
  onEquipHero,
  readOnly = false,
}: PartyPlayerCardProps) => {
  const updatePlayer = (nextPlayer: PartyPlayer) => {
    onPlayerChange?.(nextPlayer);
  };

  const handleHpChange = (hp: PartyPlayer['hp']) => {
    updatePlayer({ ...player, hp });
  };

  const handleStatCommit = (key: keyof PartyPlayerStats, value: number) => {
    updatePlayer({ ...player, stats: { ...player.stats, [key]: value } });
  };

  const handleRemoveEquippedItem = (itemId: string) => {
    updatePlayer({
      ...player,
      equippedItems: player.equippedItems.filter((item) => item.id !== itemId),
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: player.imageUri }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.headerText}>
            <Text variant="headlineMd" style={styles.name}>
              {player.name}
            </Text>
            <Text variant="bodyMd" style={styles.race}>
              {player.race}
            </Text>
          </View>
        </View>

        <HpEditor
          current={player.hp.current}
          max={player.hp.max}
          onChange={handleHpChange}
          playerName={player.name}
          readOnly={readOnly}
        />

        <View>
          <Text variant="labelMd" style={styles.sectionLabel}>
            stats
          </Text>
          <View style={styles.statsGrid}>
            {STAT_LABELS.map((label, index) => {
              const statKey = STAT_KEYS[index];

              return (
                <View key={label} style={styles.statCell}>
                  <Text style={styles.statLabel}>{label}</Text>
                  {readOnly ? (
                    <Text variant="headlineMd" style={styles.statInput}>
                      {formatStat(player.stats[statKey])}
                    </Text>
                  ) : (
                    <EditableNumberInput
                      value={player.stats[statKey]}
                      onCommit={(value) => handleStatCommit(statKey, value)}
                      formatValue={formatStat}
                      accessibilityLabel={`${player.name} ${label}`}
                      style={styles.statInput}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {player.equippedItems.length > 0 ? (
          <View style={styles.equippedSection}>
            <Text variant="labelMd" style={styles.sectionLabel}>
              Equipped
            </Text>
            <View style={styles.equippedList}>
              {player.equippedItems.map((item) => (
                <View key={item.id} style={styles.equippedItem}>
                  <Icon name={item.icon} size={20} color="onSurfaceVariant" />
                  <Text style={styles.equippedItemName}>{item.name}</Text>
                  {!readOnly ? (
                    <Pressable
                      style={styles.removeItemButton}
                      onPress={() => handleRemoveEquippedItem(item.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.name}`}
                      hitSlop={8}
                    >
                      <Icon name="close" size={18} color="onSurfaceVariant" />
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      {!readOnly ? (
        <View style={styles.equipButtonWrapper}>
          <Button title="Equip Hero" icon="build" fullWidth onPress={() => onEquipHero?.(player)} />
        </View>
      ) : null}
    </View>
  );
};
