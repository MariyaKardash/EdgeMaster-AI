import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, ButtonSecondary, CharacterCard, Text } from '@/components';
import { MOCK_PLAYERS } from './character-selection.constants';
import { styles } from './character-selection.styles';
import type { CharacterSelectionScreenProps, MockPlayer } from './character-selection.types';

export const CharacterSelectionScreen = ({
  onBack,
  onSelectCharacter,
}: CharacterSelectionScreenProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<MockPlayer | null>(null);

  const handlePlay = () => {
    if (!selectedPlayer) return;
    onSelectCharacter?.(selectedPlayer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineLgMobile" style={styles.title}>
            Choose Your Hero
          </Text>
          <Text variant="joinSessionSubtitle" style={styles.subtitle}>
            Select your avatar to begin the journey into the Void.
          </Text>
        </View>

        <ScrollView
          style={styles.heroList}
          contentContainerStyle={styles.heroListContent}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_PLAYERS.map((player) => (
            <CharacterCard
              key={player.id}
              player={player}
              selected={selectedPlayer?.id === player.id}
              onPress={() => setSelectedPlayer(player)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={selectedPlayer ? `Play as ${selectedPlayer.name}` : 'Play as'}
            fullWidth
            disabled={!selectedPlayer}
            onPress={handlePlay}
          />
          <ButtonSecondary
            title="Back"
            icon="arrow-back"
            iconPosition="leading"
            fullWidth
            onPress={onBack}
          />
        </View>
      </View>
    </View>
  );
};
