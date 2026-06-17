import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getSessionDashboardBottomNavHeight,
  Icon,
  SessionDashboardBottomNav,
  Text,
} from '@/components';
import type { PartyEquippedItem } from '@/components/molecules/party-player-card';

import { EQUIP_HERO_SCREEN_TITLE, MOCK_INVENTORY_ITEMS } from './equip-hero.constants';
import { HeroInventoryList } from './hero-inventory-list.component';
import { styles } from './equip-hero.styles';
import type { EquipHeroScreenProps } from './equip-hero.types';

export const EquipHeroScreen = ({
  player: initialPlayer,
  inventoryItems = MOCK_INVENTORY_ITEMS,
  onBack,
  onTabPress,
}: EquipHeroScreenProps) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = getSessionDashboardBottomNavHeight(insets.bottom) + 24;

  const [player, setPlayer] = useState(initialPlayer);

  const equippedItemIds = player.equippedItems.map((item) => item.id);

  const handleBack = () => {
    onBack?.(player);
  };

  const handleEquipItem = (item: PartyEquippedItem) => {
    setPlayer((current) => {
      const isAlreadyEquipped = current.equippedItems.some((equipped) => equipped.id === item.id);

      return {
        ...current,
        equippedItems: isAlreadyEquipped
          ? current.equippedItems.filter((equipped) => equipped.id !== item.id)
          : [...current.equippedItems, item],
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            onPress={handleBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="arrow-back" size={24} color="primary" />
          </Pressable>

          <Text variant="headlineMd" style={styles.headerTitle}>
            {EQUIP_HERO_SCREEN_TITLE}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroAvatar}>
              <Image
                source={{ uri: player.imageUri }}
                style={styles.heroAvatarImage}
                contentFit="cover"
              />
            </View>

            <View style={styles.heroInfo}>
              <Text variant="headlineMd" style={styles.heroName}>
                {player.name}
              </Text>
              <Text variant="bodyMd" style={styles.heroSubtitle}>
                Manage your active loadout
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inventoryHeader}>
          <Text variant="headlineMd" style={styles.inventoryTitle}>
            Inventory
          </Text>
          <Text variant="bodyMd" style={styles.inventorySubtitle}>
            Pick an item to equip instantly.
          </Text>
        </View>

        <HeroInventoryList
          inventoryItems={inventoryItems}
          equippedItemIds={equippedItemIds}
          onEquip={handleEquipItem}
        />
      </ScrollView>

      <SessionDashboardBottomNav activeTab="players" onTabPress={onTabPress} />
    </View>
  );
};
