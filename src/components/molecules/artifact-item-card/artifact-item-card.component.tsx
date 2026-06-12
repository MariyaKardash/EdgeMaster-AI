import { Switch, View } from 'react-native';

import { Icon, Text } from '@/components';
import { colors } from '@/theme';
import { styles } from './artifact-item-card.styles';
import type { ArtifactItemCardProps, ArtifactRarity } from './artifact-item-card.types';

const RARITY_LABELS: Record<ArtifactRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
};

const getRarityStyles = (rarity: ArtifactRarity) => {
  switch (rarity) {
    case 'epic':
      return { badge: styles.rarityEpic, text: styles.rarityEpicText };
    case 'rare':
      return { badge: styles.rarityRare, text: styles.rarityRareText };
    default:
      return { badge: styles.rarityCommon, text: styles.rarityCommonText };
  }
};

export const ArtifactItemCard = ({ item, available, onToggle }: ArtifactItemCardProps) => {
  const rarityStyles = getRarityStyles(item.rarity);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Icon name={item.icon} size={28} color="primary" />
        </View>

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text variant="headlineMd" style={styles.name}>
              {item.name}
            </Text>
            <View style={[styles.rarityBadge, rarityStyles.badge]}>
              <Text style={[styles.rarityText, rarityStyles.text]}>
                {RARITY_LABELS[item.rarity]}
              </Text>
            </View>
          </View>
          <Text variant="codeMd" style={styles.description}>
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text variant="labelMd" style={styles.availabilityLabel}>
          Available at start
        </Text>
        <Switch
          value={available}
          onValueChange={onToggle}
          trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
          thumbColor={colors.onSurface}
        />
      </View>
    </View>
  );
};
