import { StyleSheet } from 'react-native-unistyles';

import { withAlphaHex } from '@/theme/color-utils';

const INPUT_BORDER_WIDTH = 2;

const getSingleLineInputHeight = (lineHeight: number, paddingVertical: number) =>
  lineHeight + paddingVertical * 2;

export const styles = StyleSheet.create((theme) => {
  const paddingVertical = theme.spacing.md;
  const lineHeight = theme.textStyles.bodyMd.lineHeight ?? theme.textStyles.bodyMd.fontSize ?? 16;
  const singleLineInputHeight = getSingleLineInputHeight(lineHeight, paddingVertical);

  return {
    input: {
      width: '100%',
      backgroundColor: theme.colors.surfaceContainerLowest,
      borderWidth: INPUT_BORDER_WIDTH,
      borderColor: withAlphaHex('outlineVariant', 0.3),
      borderRadius: theme.radius.md,
      paddingVertical,
      paddingHorizontal: theme.spacing.lg,
      fontFamily: theme.textStyles.bodyMd.fontFamily,
      fontSize: theme.textStyles.bodyMd.fontSize,
      lineHeight,
      color: theme.colors.onSurface,
      variants: {
        centered: {
          true: {
            textAlign: 'center',
          },
        },
        centeredAndroid: {
          true: {
            textAlignVertical: 'center',
            includeFontPadding: false,
            height: singleLineInputHeight,
            minHeight: singleLineInputHeight,
            maxHeight: singleLineInputHeight,
          },
        },
        error: {
          true: {
            borderColor: withAlphaHex('error', 0.4),
          },
        },
      },
    },
  };
});
