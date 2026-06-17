import { Pressable, View } from 'react-native';

import { Icon, Text } from '@/components';
import type { PartyEquippedItem } from '@/components/molecules/party-player-card';

import { styles } from './equip-hero.styles';
import type { InventoryItem } from './equip-hero.types';

type InventoryItemRowProps = {
  item: InventoryItem;
  isEquipped: boolean;
  readOnly?: boolean;
  onEquip?: (item: PartyEquippedItem) => void;
};

export const InventoryItemRow = ({
  item,
  isEquipped,
  readOnly = false,
  onEquip,
}: InventoryItemRowProps) => {
  const categoryLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);

  const handleEquip = () => {
    if (readOnly) {
      return;
    }

    onEquip?.({
      id: item.id,
      name: item.name,
      icon: item.icon,
    });
  };

  const isEquippedState = isEquipped;
  styles.useVariants({ equipped: isEquippedState });

  const cardContent = (
    <>
      <View style={styles.itemAccent} />
      <View style={styles.itemContent}>
        <View style={styles.itemIconBox}>
          <Icon name={item.icon} size={24} color="primary" />
        </View>
        <View style={styles.itemText}>
          <View style={styles.itemHeaderRow}>
            <Text variant="headlineMd" style={styles.itemName}>
              {item.name}
            </Text>
            <View style={styles.itemCategoryBadge}>
              <Text variant="labelMd" style={styles.itemCategoryLabel}>
                {categoryLabel}
              </Text>
            </View>
          </View>
          <View style={styles.itemMetaRow}>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        </View>
      </View>

      {readOnly ? (
        isEquippedState ? (
          <View style={styles.itemStatusChip}>
            <Icon name="check-circle" size={14} color="onBackground" />
            <Text variant="labelMd" style={styles.itemStatusLabel}>
              Equipped
            </Text>
          </View>
        ) : null
      ) : (
        <View style={styles.itemStatusChip}>
          <Icon
            name={isEquippedState ? 'check-circle' : 'touch-app'}
            size={14}
            color={isEquippedState ? 'onBackground' : 'onSurfaceVariant'}
          />
          <Text variant="labelMd" style={styles.itemStatusLabel}>
            {isEquippedState ? 'Equipped' : 'Tap to equip'}
          </Text>
        </View>
      )}
    </>
  );

  if (readOnly) {
    return <View style={styles.itemCard}>{cardContent}</View>;
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.itemCard, pressed && styles.itemCardPressed]}
      onPress={handleEquip}
      accessibilityRole="button"
      accessibilityLabel={`${isEquippedState ? 'Unequip' : 'Equip'} ${item.name}`}
      accessibilityState={{ selected: isEquippedState }}
    >
      {cardContent}
    </Pressable>
  );
};
