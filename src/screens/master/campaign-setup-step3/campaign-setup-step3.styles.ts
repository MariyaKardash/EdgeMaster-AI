import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  itemList: {
    gap: theme.spacing.md,
  },
  newItemCard: {
    marginTop: theme.spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: withAlphaHex('primary', 0.2),
    borderRadius: theme.radius.lg,
    backgroundColor: withAlphaHex('surfaceContainerLowest', 0.5),
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  newItemIntro: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  newItemIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: withAlphaHex('primary', 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  newItemTitle: {
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  newItemSubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  newItemForm: {
    gap: theme.spacing.md,
  },
  field: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    color: withAlphaHex('primary', 0.7),
    marginLeft: theme.spacing.xs,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  fieldHalf: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  formInput: {
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.1),
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
  descriptionInput: {
    height: 96,
    textAlignVertical: 'top',
  },
  forgeButton: {
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: withAlphaHex('primary', 0.3),
    backgroundColor: withAlphaHex('primary', 0.2),
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  forgeButtonLabel: {
    color: theme.colors.primary,
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    fontWeight: '700',
  },
  footer: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    backgroundColor: withAlphaHex('surfaceContainerLowest', 0.8),
  },
}));
