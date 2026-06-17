import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('primary', 0.1),
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    flex: 1,
    color: theme.colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  heroCard: {
    backgroundColor: withAlphaHex('surfaceContainer', 0.78),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.22),
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    shadowColor: theme.colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('outline', 0.25),
    overflow: 'hidden',
  },
  heroAvatarImage: {
    width: '100%',
    height: '100%',
  },
  heroInfo: {
    flex: 1,
    gap: theme.spacing.xs,
    paddingRight: theme.spacing.xl,
  },
  heroName: {
    color: theme.colors.onSurface,
  },
  heroSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  heroMetaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: withAlphaHex('surfaceContainerHigh', 0.58),
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  heroMetaLabel: {
    color: withAlphaHex('onSurfaceVariant', 0.75),
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroMetaText: {
    color: theme.colors.onSurface,
    fontSize: 14,
  },
  inventoryHeader: {
    gap: theme.spacing.xs,
  },
  inventoryTitle: {
    color: theme.colors.onSurface,
  },
  inventorySubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.24),
    backgroundColor: withAlphaHex('surfaceContainerHigh', 0.65),
  },
  filterChipActive: {
    borderColor: withAlphaHex('primary', 0.45),
    backgroundColor: withAlphaHex('primaryContainer', 0.65),
    shadowColor: theme.colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  filterChipPressed: {
    opacity: 0.72,
  },
  filterChipLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  filterChipLabelActive: {
    color: theme.colors.onBackground,
  },
  categorySection: {
    gap: theme.spacing.sm,
  },
  categoryTitle: {
    color: theme.colors.primary,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: theme.spacing.xs,
  },
  itemList: {
    gap: theme.spacing.sm,
  },
  itemCard: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    backgroundColor: withAlphaHex('surfaceContainer', 0.86),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.22),
    padding: theme.spacing.md,
    overflow: 'hidden',
    variants: {
      equipped: {
        true: {
          borderColor: withAlphaHex('tertiary', 0.3),
          backgroundColor: withAlphaHex('tertiaryContainer', 0.18),
        },
      },
    },
  },
  itemCardPressed: {
    opacity: 0.78,
  },
  itemAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: withAlphaHex('primary', 0.28),
    variants: {
      equipped: {
        true: {
          backgroundColor: withAlphaHex('tertiary', 0.65),
        },
      },
    },
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  itemIconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: withAlphaHex('surfaceContainerHigh', 0.78),
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.22),
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      equipped: {
        true: {
          borderColor: withAlphaHex('tertiary', 0.3),
          backgroundColor: withAlphaHex('tertiaryContainer', 0.28),
        },
      },
    },
  },
  itemText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  itemHeaderRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  itemName: {
    color: theme.colors.onSurface,
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDescription: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    flex: 1,
  },
  itemCategoryBadge: {
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
    backgroundColor: withAlphaHex('surfaceContainerHighest', 0.35),
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    variants: {
      equipped: {
        true: {
          borderColor: withAlphaHex('tertiary', 0.35),
          backgroundColor: withAlphaHex('tertiaryContainer', 0.5),
        },
      },
    },
  },
  itemCategoryLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: theme.colors.onSurfaceVariant,
  },
  itemStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.3),
    backgroundColor: withAlphaHex('surfaceContainerHighest', 0.32),
    variants: {
      equipped: {
        true: {
          borderColor: withAlphaHex('tertiary', 0.35),
          backgroundColor: withAlphaHex('tertiaryContainer', 0.5),
        },
      },
    },
  },
  itemStatusLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    fontWeight: '700',
    variants: {
      equipped: {
        true: {
          color: '#FFFFFF',
        },
      },
    },
  },
}));
