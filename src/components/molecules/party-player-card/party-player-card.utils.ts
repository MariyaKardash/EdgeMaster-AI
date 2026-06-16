const MIN_VALUE = 0;
const MAX_VALUE = 99;
const MIN_HP_MAX = 1;

export const clampStat = (value: number, min = MIN_VALUE, max = MAX_VALUE) =>
  Math.min(max, Math.max(min, Math.round(value)));

export const sanitizeNumericDraft = (text: string, maxLength: number) =>
  text.replace(/\D/g, '').slice(0, maxLength);

export const commitNumericDraft = (
  text: string,
  fallback: number,
  min = MIN_VALUE,
  max = MAX_VALUE,
) => {
  if (!text) {
    return clampStat(fallback, min, max);
  }

  return clampStat(Number.parseInt(text, 10), min, max);
};

export const parseNumericInput = (text: string, fallback: number) => {
  const digits = text.replace(/\D/g, '');
  if (!digits) {
    return fallback;
  }

  return clampStat(Number.parseInt(digits, 10));
};

export const clampHpCurrent = (current: number, max: number) =>
  Math.min(max, Math.max(MIN_VALUE, Math.round(current)));

export const clampHpMax = (max: number) =>
  Math.min(MAX_VALUE, Math.max(MIN_HP_MAX, Math.round(max)));
