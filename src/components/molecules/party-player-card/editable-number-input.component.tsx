import { useState } from 'react';
import { TextInput } from 'react-native';

import { colors, withAlphaHex } from '@/theme';
import { commitNumericDraft, sanitizeNumericDraft } from './party-player-card.utils';
import type { EditableNumberInputProps } from './editable-number-input.types';

export const EditableNumberInput = ({
  value,
  onCommit,
  formatValue = String,
  min = 0,
  max = 99,
  maxLength = 2,
  style,
  accessibilityLabel,
}: EditableNumberInputProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const isEditing = draft !== null;

  const handleBlur = () => {
    if (!isEditing) {
      return;
    }

    onCommit(commitNumericDraft(draft, value, min, max));
    setDraft(null);
  };

  return (
    <TextInput
      value={isEditing ? draft : formatValue(value)}
      onFocus={() => setDraft(String(value))}
      onChangeText={(text) => setDraft(sanitizeNumericDraft(text, maxLength))}
      onBlur={handleBlur}
      keyboardType="number-pad"
      maxLength={maxLength}
      accessibilityLabel={accessibilityLabel}
      style={style}
      cursorColor={colors.primaryContainer}
      selectionColor={withAlphaHex('primaryContainer', 0.3)}
    />
  );
};
