import { StyleSheet } from 'react-native-unistyles';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  sessionCode: {
    letterSpacing: 4,
    textAlign: 'center',
  },
  meta: {
    color: colors.onSurfaceVariant,
  },
  actions: {
    gap: spacing.sm,
  },
});
