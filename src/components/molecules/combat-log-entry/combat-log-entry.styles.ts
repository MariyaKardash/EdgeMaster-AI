import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  item: {
    position: 'relative',
    flexDirection: 'row',
    paddingLeft: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 16,
    bottom: 0,
    width: 2,
    backgroundColor: withAlphaHex('primary', 0.25),
  },
  timelineNode: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 16,
    height: 16,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    zIndex: 1,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginLeft: theme.spacing.md,
  },
  accentBar: {
    width: 4,
    backgroundColor: theme.colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timestamp: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 18,
  },
  message: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
}));
