import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components';
import type { PartyEquippedItem } from '@/components/molecules/party-player-card';

import {
  INVENTORY_CATEGORY_LABELS,
  INVENTORY_FILTERS,
  MOCK_INVENTORY_ITEMS,
} from './equip-hero.constants';
import { InventoryItemRow } from './inventory-item-row.component';
import { styles } from './equip-hero.styles';
import type { InventoryCategory, InventoryFilter, InventoryItem } from './equip-hero.types';

const CATEGORY_ORDER: InventoryCategory[] = ['weapons', 'armor', 'utility'];

const groupItemsByCategory = (items: InventoryItem[]) =>
  CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

export type HeroInventoryListProps = {
  inventoryItems?: InventoryItem[];
  equippedItemIds: Iterable<string>;
  readOnly?: boolean;
  onEquip?: (item: PartyEquippedItem) => void;
};

export const HeroInventoryList = ({
  inventoryItems = MOCK_INVENTORY_ITEMS,
  equippedItemIds,
  readOnly = false,
  onEquip,
}: HeroInventoryListProps) => {
  const [activeFilter, setActiveFilter] = useState<InventoryFilter>('all');
  const equippedIds = new Set(equippedItemIds);

  const filteredGroups =
    activeFilter === 'all'
      ? groupItemsByCategory(inventoryItems)
      : [
          {
            category: activeFilter,
            items: inventoryItems.filter((item) => item.category === activeFilter),
          },
        ].filter((group) => group.items.length > 0);

  return (
    <View style={styles.inventoryListSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {INVENTORY_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <Pressable
              key={filter.id}
              style={({ pressed }) => [
                styles.filterChip,
                isActive && styles.filterChipActive,
                pressed && styles.filterChipPressed,
              ]}
              onPress={() => setActiveFilter(filter.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                variant="labelMd"
                style={[styles.filterChipLabel, isActive && styles.filterChipLabelActive]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filteredGroups.map((group) => (
        <View key={group.category} style={styles.categorySection}>
          {activeFilter === 'all' ? (
            <Text variant="labelMd" style={styles.categoryTitle}>
              {INVENTORY_CATEGORY_LABELS[group.category]}
            </Text>
          ) : null}

          <View style={styles.itemList}>
            {group.items.map((item) => (
              <InventoryItemRow
                key={item.id}
                item={item}
                isEquipped={equippedIds.has(item.id)}
                readOnly={readOnly}
                onEquip={onEquip}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};
