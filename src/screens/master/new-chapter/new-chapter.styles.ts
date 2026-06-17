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

  headerTitle: {
    flex: 1,
    fontFamily: theme.textStyles.headlineMd.fontFamily,
    fontSize: theme.textStyles.headlineMd.fontSize,
    lineHeight: theme.textStyles.headlineMd.lineHeight,
    fontWeight: theme.textStyles.headlineMd.fontWeight,
    color: theme.colors.primary,
  },

  modelStatusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },

  modelStatusText: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },

  titleInput: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.5),
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.onSurface,
    fontFamily: theme.textStyles.headlineMd.fontFamily,
    fontSize: theme.textStyles.headlineMd.fontSize,
    lineHeight: theme.textStyles.headlineMd.lineHeight,
  },

  // Prompt tab content
  promptInput: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.5),
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.onSurface,
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: withAlphaHex('tertiary', 0.15),
    borderWidth: 1,
    borderColor: withAlphaHex('tertiary', 0.3),
  },

  generateButtonDisabled: {
    opacity: 0.4,
  },

  generateButtonLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.tertiary,
  },

  // Doc tab content
  filePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: withAlphaHex('outlineVariant', 0.5),
    backgroundColor: theme.colors.surfaceContainerLow,
    minHeight: 120,
  },

  filePickerLabel: {
    fontFamily: theme.textStyles.bodyMd.fontFamily,
    fontSize: theme.textStyles.bodyMd.fontSize,
    lineHeight: theme.textStyles.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },

  filePickerHint: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: withAlphaHex('onSurfaceVariant', 0.5),
  },

  // Bottom strip
  bottomStrip: {
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: withAlphaHex('primary', 0.1),
    backgroundColor: theme.colors.background,
  },

  errorMessage: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.error,
    paddingHorizontal: theme.spacing.xs,
  },

  sectionLabel: {
    fontFamily: theme.textStyles.labelMd.fontFamily,
    fontSize: theme.textStyles.labelMd.fontSize,
    lineHeight: theme.textStyles.labelMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    letterSpacing: theme.textStyles.labelMd.letterSpacing,
    textTransform: 'uppercase',
  },
}));
