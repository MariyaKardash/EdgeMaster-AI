import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const CARD_BACKGROUND = '#2A2420';

export const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
  },
  content: {
    padding: theme.spacing.containerMargin,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: withAlphaHex('primary', 0.2),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  headerText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    color: theme.colors.onSurface,
  },
  race: {
    color: theme.colors.onSurfaceVariant,
  },
  sectionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCell: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statInput: {
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    fontFamily: theme.textStyles.codeMd.fontFamily,
    fontSize: theme.textStyles.codeMd.fontSize,
    lineHeight: theme.textStyles.codeMd.lineHeight,
    fontWeight: '700',
    color: theme.colors.primaryContainer,
    textAlign: 'center',
  },
  equippedSection: {
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('outlineVariant', 0.1),
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  equippedList: {
    gap: theme.spacing.sm,
  },
  equippedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: withAlphaHex('surfaceContainerLow', 0.5),
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
  },
  equippedItemName: {
    flex: 1,
    color: theme.colors.primaryContainer,
    fontSize: 13,
    fontWeight: '500',
  },
  removeItemButton: {
    padding: theme.spacing.xs,
    marginRight: -theme.spacing.xs,
  },
  equipButtonWrapper: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.containerMargin,
    paddingTop: theme.spacing.sm,
  },
}));
