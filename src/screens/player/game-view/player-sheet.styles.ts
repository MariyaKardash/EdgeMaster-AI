import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  sheetContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 16,
    zIndex: 30,
    overflow: 'hidden',
  },
  sheetBackground: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('outlineVariant', 0.2),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  sheetHandle: {
    width: '100%',
  },
  hiddenHandleIndicator: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  handleRow: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: withAlphaHex('outlineVariant', 0.4),
  },
  tabsRow: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('outlineVariant', 0.1),
    paddingHorizontal: theme.spacing.md,
  },
  safeAreaFill: {
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  tabLabelActive: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  contentScroll: {
    flex: 1,
    backgroundColor: withAlphaHex('surface', 0.5),
    overflow: 'hidden',
  },
  contentScrollInner: {
    paddingHorizontal: theme.spacing.gutter,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  statsTabContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  historyTabContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  inventoryTabContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
}));
