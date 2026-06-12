import { colors, type ColorToken } from './colors';

const resolveColor = (tokenOrHex: ColorToken | string): string =>
  tokenOrHex in colors ? colors[tokenOrHex as ColorToken] : tokenOrHex;

/** Returns a color token value as 8-digit hex (#RRGGBBAA). */
export const withAlphaHex = (tokenOrHex: ColorToken | string, alpha: number): string => {
  const color = resolveColor(tokenOrHex);
  const alphaByte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');

  return `${color}${alphaByte}`;
};

/** Returns a color token value as an rgba() string. */
export const withAlpha = (token: ColorToken, alpha: number): string => {
  const hex = colors[token].replace('#', '');
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getColor = (token: ColorToken): string => colors[token];
