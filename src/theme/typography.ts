import { TextStyle } from 'react-native';

export const fonts = {
  headline: 'PlayfairDisplay_600SemiBold',
  headlineBold: 'PlayfairDisplay_700Bold',
  body: 'DMSans_500Medium',
  bodyRegular: 'DMSans_400Regular',
  mono: 'SpaceMono_400Regular',
} as const;

function parsePx(value: string): number {
  return Number.parseFloat(value);
}

function parseLetterSpacing(value: string | undefined, fontSize: number): number | undefined {
  if (!value) return undefined;
  if (value.endsWith('em')) {
    return parsePx(value) * fontSize;
  }
  return parsePx(value);
}

function createTextStyle(
  fontFamily: string,
  fontSize: string,
  fontWeight: TextStyle['fontWeight'],
  lineHeight: string,
  letterSpacing?: string,
): TextStyle {
  const size = parsePx(fontSize);
  return {
    fontFamily,
    fontSize: size,
    fontWeight,
    lineHeight: parsePx(lineHeight),
    letterSpacing: parseLetterSpacing(letterSpacing, size),
  };
}

/**
 * Typography scale — imported from Stitch design system
 */
export const textStyles = {
  displayLg: createTextStyle(fonts.headlineBold, '48px', '700', '56px', '-0.02em'),
  headlineLg: createTextStyle(fonts.headline, '32px', '600', '40px'),
  headlineLgMobile: createTextStyle(fonts.headline, '28px', '600', '36px'),
  headlineMd: createTextStyle(fonts.headline, '24px', '600', '32px'),
  bodyLg: createTextStyle(fonts.bodyRegular, '18px', '400', '28px'),
  bodyMd: createTextStyle(fonts.bodyRegular, '16px', '400', '24px'),
  labelMd: createTextStyle(fonts.body, '14px', '500', '20px', '0.05em'),
  codeMd: createTextStyle(fonts.mono, '16px', '400', '24px'),
} as const satisfies Record<string, TextStyle>;

export type TextStyleToken = keyof typeof textStyles;
