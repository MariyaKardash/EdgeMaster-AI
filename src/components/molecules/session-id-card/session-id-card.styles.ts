import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  section: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  cardWrapper: {
    width: '100%',
    position: 'relative',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: theme.colors.primary + '33',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  sessionId: {
    color: theme.colors.onBackground,
    letterSpacing: 2,
    fontSize: theme.textStyles.headlineMd.fontSize,
    lineHeight: theme.textStyles.headlineMd.lineHeight,
  },
  copyButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
}));
