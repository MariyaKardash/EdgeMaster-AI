export const colors = {
  // Surfaces
  background: '#17130f',
  surface: '#17130f',
  surfaceDim: '#17130f',
  surfaceBright: '#3d3833',
  surfaceContainerLowest: '#110e0a',
  surfaceContainerLow: '#1f1b17',
  surfaceContainer: '#231f1b',
  surfaceContainerHigh: '#2e2925',
  surfaceContainerHighest: '#39342f',
  surfaceVariant: '#39342f',
  surfaceTint: '#ecc246',

  // On-surface text
  onBackground: '#eae1da',
  onSurface: '#eae1da',
  onSurfaceVariant: '#d1c5af',

  // Primary — Aged Gold
  primary: '#ecc246',
  onPrimary: '#3d2e00',
  primaryContainer: '#c9a227',
  onPrimaryContainer: '#4b3a00',
  primaryFixed: '#ffe08e',
  primaryFixedDim: '#ecc246',
  onPrimaryFixed: '#241a00',
  onPrimaryFixedVariant: '#584400',
  inversePrimary: '#755b00',

  // Secondary — Ember Orange
  secondary: '#ffb598',
  onSecondary: '#591c00',
  secondaryContainer: '#7d310d',
  onSecondaryContainer: '#ffa17a',
  secondaryFixed: '#ffdbce',
  secondaryFixedDim: '#ffb598',
  onSecondaryFixed: '#370e00',
  onSecondaryFixedVariant: '#7a2f0b',
  ember: '#d4734a',

  // Tertiary — Deep Violet
  tertiary: '#cebdff',
  onTertiary: '#352562',
  tertiaryContainer: '#ae9ce2',
  onTertiaryContainer: '#41316f',
  tertiaryFixed: '#e8ddff',
  tertiaryFixedDim: '#cebdff',
  onTertiaryFixed: '#200d4c',
  onTertiaryFixedVariant: '#4c3c7a',

  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Outline & inverse
  outline: '#99907b',
  outlineVariant: '#4d4635',
  inverseSurface: '#eae1da',
  inverseOnSurface: '#34302b',

  // Role & status semantics
  gameMaster: '#5b4b8a',
  player: '#3d7a6e',
  connected: '#4a7c59',
  agedGold: '#c9a227',
  neutral: '#1a1612',
} as const;

export type ColorToken = keyof typeof colors;
