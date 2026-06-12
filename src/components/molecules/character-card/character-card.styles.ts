import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

/** Layout inset reserved for shadow/glow so ScrollView does not clip effects. */
export const CARD_EFFECT_INSET = 12;

export const styles = StyleSheet.create((theme) => ({
  cardSlot: {
    padding: CARD_EFFECT_INSET,
  },
  shadowWrapper: {
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowWrapperSelected: {
    zIndex: 1,
  },
  selectionGlow: {
    position: 'absolute',
    top: -CARD_EFFECT_INSET / 2,
    right: -CARD_EFFECT_INSET / 2,
    bottom: -CARD_EFFECT_INSET / 2,
    left: -CARD_EFFECT_INSET / 2,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: withAlphaHex('primary', 0.08),
  },
  card: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.45,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.3),
    backgroundColor: theme.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  classLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: withAlphaHex('outlineVariant', 0.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: withAlphaHex('primary', 0.5),
  },
  statValue: {
    color: theme.colors.primary,
  },
  name: {
    color: theme.colors.primary,
  },
}));
