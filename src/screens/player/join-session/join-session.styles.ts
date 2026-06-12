import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.containerMargin,
    paddingBottom: theme.spacing.xl + theme.spacing.sm,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 512,
    alignSelf: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.2),
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    maxWidth: 280,
    opacity: 0.8,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: withAlphaHex('outlineVariant', 0.15),
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    overflow: 'hidden',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withAlphaHex('primary', 0.03),
    opacity: 0.5,
  },
  form: {
    gap: theme.spacing.lg,
    zIndex: 1,
  },
  actions: {
    gap: theme.spacing.md,
    width: '100%',
  },
  inputSection: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: withAlphaHex('outlineVariant', 0.3),
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontFamily: theme.textStyles.codeMd.fontFamily,
    fontSize: theme.textStyles.codeMd.fontSize,
    lineHeight: theme.textStyles.codeMd.lineHeight,
    color: theme.colors.primary,
  },
  cornerBracket: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: withAlphaHex('primary', 0.2),
  },
  cornerTopLeft: {
    top: 8,
    left: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTopRight: {
    top: 8,
    right: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBottomLeft: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBottomRight: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  helperText: {
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: withAlphaHex('errorContainer', 0.1),
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: withAlphaHex('error', 0.2),
  },
  features: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    opacity: 0.8,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  featureDivider: {
    borderLeftWidth: 1,
    borderLeftColor: withAlphaHex('outlineVariant', 0.1),
  },
  featureLabel: {
    fontSize: 10,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    color: theme.colors.outlineVariant,
    textAlign: 'center',
  },
}));
