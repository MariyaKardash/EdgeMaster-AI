import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.15),
    padding: theme.spacing.md,
    overflow: 'hidden',
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  name: {
    color: theme.colors.onSurface,
    fontSize: 18,
    lineHeight: 24,
  },
  rarityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  rarityCommon: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  rarityCommonText: {
    color: theme.colors.onSurfaceVariant,
  },
  rarityRare: {
    backgroundColor: theme.colors.tertiaryContainer,
  },
  rarityRareText: {
    color: theme.colors.onTertiaryContainer,
  },
  rarityEpic: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  rarityEpicText: {
    color: theme.colors.onSecondaryContainer,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('outline', 0.1),
  },
  availabilityLabel: {
    color: theme.colors.onSurfaceVariant,
  },
}));
