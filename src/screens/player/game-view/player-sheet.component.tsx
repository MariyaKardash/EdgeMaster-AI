import GorhomBottomSheet, {
  BottomSheetHandle,
  BottomSheetScrollView,
  type BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { CombatLogEntry, Icon, PartyPlayerCard, Text } from '@/components';
import type { EventLogEntryData } from '@/components/molecules/combat-log-entry';
import type { PartyPlayer } from '@/components/molecules/party-player-card';
import { HeroInventoryList, MOCK_INVENTORY_ITEMS } from '@/screens/master/equip-hero';
import type { InventoryItem } from '@/screens/master/equip-hero';
import {
  MOCK_GAME_LOG,
  MOCK_PARTY_PLAYER,
  PLAYER_SHEET_EXPANDED_HEIGHT,
  PLAYER_SHEET_HEADER_HEIGHT,
} from './game-view.constants';
import type { PlayerSheetTab } from './game-view.types';
import { styles } from './player-sheet.styles';

type PlayerSheetProps = {
  safeAreaBottom: number;
  partyPlayer?: PartyPlayer;
  inventoryItems?: InventoryItem[];
  gameLog?: EventLogEntryData[];
};

const SHEET_TABS: {
  id: PlayerSheetTab;
  label: string;
  icon: 'show-chart' | 'inventory-2' | 'history-edu';
}[] = [
  { id: 'stats', label: 'Stats', icon: 'show-chart' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory-2' },
  { id: 'history', label: 'History', icon: 'history-edu' },
];

export const PlayerSheet = ({
  safeAreaBottom,
  partyPlayer = MOCK_PARTY_PLAYER,
  inventoryItems = MOCK_INVENTORY_ITEMS,
  gameLog = MOCK_GAME_LOG,
}: PlayerSheetProps) => {
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<PlayerSheetTab>('stats');

  const snapPoints = useMemo(
    () => [
      PLAYER_SHEET_HEADER_HEIGHT + safeAreaBottom,
      PLAYER_SHEET_EXPANDED_HEIGHT + safeAreaBottom,
    ],
    [safeAreaBottom],
  );

  const handleSheetChange = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  const openSheet = useCallback(() => {
    setIsExpanded(true);
    sheetRef.current?.snapToIndex(1);
  }, []);

  const closeSheet = useCallback(() => {
    setIsExpanded(false);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const toggleSheet = useCallback(() => {
    if (isExpanded) {
      closeSheet();
      return;
    }

    openSheet();
  }, [closeSheet, isExpanded, openSheet]);

  const handleTabPress = useCallback(
    (tab: PlayerSheetTab) => {
      setActiveTab(tab);
      openSheet();
    },
    [openSheet],
  );

  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <BottomSheetHandle
        {...props}
        indicatorStyle={styles.hiddenHandleIndicator}
        style={styles.sheetHandle}
      >
        <Pressable
          style={styles.handleRow}
          onPress={toggleSheet}
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? 'Collapse player sheet' : 'Expand player sheet'}
        >
          <View style={styles.handle} />
        </Pressable>

        <View style={styles.tabsRow}>
          {SHEET_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => handleTabPress(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Icon name={tab.icon} size={18} color={isActive ? 'primary' : 'onSurfaceVariant'} />
                <Text variant="labelMd" style={isActive ? styles.tabLabelActive : styles.tabLabel}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {!isExpanded ? <View style={[styles.safeAreaFill, { height: safeAreaBottom }]} /> : null}
      </BottomSheetHandle>
    ),
    [activeTab, handleTabPress, isExpanded, safeAreaBottom, toggleSheet],
  );

  return (
    <GorhomBottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={false}
      bottomInset={0}
      handleComponent={renderHandle}
      backgroundStyle={styles.sheetBackground}
      style={styles.sheetContainer}
    >
      <BottomSheetScrollView
        style={styles.contentScroll}
        contentContainerStyle={{ paddingBottom: safeAreaBottom }}
        scrollEnabled={isExpanded}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'stats' ? (
          <View style={styles.statsTabContent}>
            <PartyPlayerCard player={partyPlayer} readOnly />
          </View>
        ) : null}
        {activeTab === 'inventory' ? (
          <View style={styles.inventoryTabContent}>
            <HeroInventoryList
              inventoryItems={inventoryItems}
              equippedItemIds={partyPlayer.equippedItems.map((item) => item.id)}
              readOnly
            />
          </View>
        ) : null}
        {activeTab === 'history' ? (
          <View style={styles.historyTabContent}>
            {gameLog.map((entry, index) => (
              <CombatLogEntry key={entry.id} entry={entry} isLast={index === gameLog.length - 1} />
            ))}
          </View>
        ) : null}
      </BottomSheetScrollView>
    </GorhomBottomSheet>
  );
};
