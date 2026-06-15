import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    variants: {
      status: {
        active: {
          backgroundColor: theme.colors.surfaceContainerHigh,
          borderColor: withAlphaHex('primary', 0.2),
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.primary,
        },
        completed: {
          backgroundColor: theme.colors.surfaceContainer,
          borderColor: withAlphaHex('outlineVariant', 0.2),
        },
        draft: {
          backgroundColor: theme.colors.surfaceContainerLow,
          borderColor: withAlphaHex('outlineVariant', 0.1),
          borderStyle: 'dashed',
        },
      },
    },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    variants: {
      status: {
        active: {
          backgroundColor: theme.colors.primary,
        },
        completed: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        draft: {
          backgroundColor: theme.colors.tertiaryContainer,
        },
      },
    },
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    variants: {
      status: {
        active: {
          color: theme.colors.onPrimary,
        },
        completed: {
          color: theme.colors.onSurfaceVariant,
        },
        draft: {
          color: theme.colors.onTertiaryContainer,
        },
      },
    },
  },
  dateLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  title: {
    fontSize: 18,
    color: theme.colors.onSurface,
    variants: {
      status: {
        draft: {
          color: theme.colors.onSurfaceVariant,
        },
      },
    },
  },
  description: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    variants: {
      status: {
        active: {},
        completed: {
          opacity: 0.6,
          fontStyle: 'italic',
        },
        draft: {
          opacity: 0.4,
        },
      },
    },
  },
  trailingIcon: {
    variants: {
      status: {
        active: {
          opacity: 1,
        },
        completed: {
          opacity: 0.5,
        },
        draft: {
          opacity: 0.3,
        },
      },
    },
  },
}));
