import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: withAlphaHex('primary', 0.1),
  },
  title: {
    fontFamily: theme.textStyles.headlineMd.fontFamily,
    fontSize: theme.textStyles.headlineMd.fontSize,
    lineHeight: theme.textStyles.headlineMd.lineHeight,
    fontWeight: theme.textStyles.headlineMd.fontWeight,
    color: theme.colors.primary,
  },
  subtitle: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  progressBar: {
    height: 3,
    backgroundColor: withAlphaHex('primary', 0.15),
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    marginTop: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xl,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primaryContainer,
    borderBottomRightRadius: theme.radius.sm,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderBottomLeftRadius: theme.radius.sm,
  },
  bubbleText: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
  bubbleTextUser: {
    color: theme.colors.onPrimaryContainer,
  },
  bubbleStats: {
    fontFamily: theme.textStyles.codeMd.fontFamily,
    fontSize: 11,
    lineHeight: 16,
    color: withAlphaHex('onSurfaceVariant', 0.6),
    marginTop: theme.spacing.xs,
  },
  inputRow: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: withAlphaHex('primary', 0.2),
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
}));
