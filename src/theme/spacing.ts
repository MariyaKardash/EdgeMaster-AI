export const spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  containerMargin: 20,
  gutter: 16,
} as const;

export type SpacingToken = keyof typeof spacing;
