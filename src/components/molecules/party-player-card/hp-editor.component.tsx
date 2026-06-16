import { Pressable, View } from 'react-native';

import { Text } from '@/components/atoms/text';
import { EditableNumberInput } from './editable-number-input.component';
import { styles } from './hp-editor.styles';
import type { HpEditorProps } from './hp-editor.types';
import { clampHpCurrent, clampHpMax } from './party-player-card.utils';

const getHpRatio = (current: number, max: number) => (max > 0 ? current / max : 0);

export const HpEditor = ({ current, max, onChange, playerName }: HpEditorProps) => {
  const hpRatio = getHpRatio(current, max);
  const isLowHp = hpRatio < 0.5;
  const hpPercent = Math.round(hpRatio * 100);
  const canDecrease = current > 0;
  const canIncrease = current < max;

  const updateHp = (nextCurrent: number, nextMax = max) => {
    const clampedMax = clampHpMax(nextMax);
    onChange({
      max: clampedMax,
      current: clampHpCurrent(nextCurrent, clampedMax),
    });
  };

  const adjustCurrent = (delta: number) => {
    updateHp(current + delta);
  };

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <View style={styles.headerRow}>
          <Text variant="labelMd" style={styles.label}>
            HP
          </Text>
          <Text variant="labelMd" style={styles.percentLabel}>
            {hpPercent}%
          </Text>
        </View>

        <View style={styles.controlsRow}>
          <Pressable
            style={[styles.stepperButton, !canDecrease && styles.stepperButtonDisabled]}
            onPress={() => adjustCurrent(-1)}
            disabled={!canDecrease}
            accessibilityRole="button"
            accessibilityLabel={`Decrease ${playerName} HP by 1`}
          >
            <Text style={styles.stepperButtonLabel}>−</Text>
          </Pressable>

          <View style={styles.valueGroup}>
            <EditableNumberInput
              value={current}
              onCommit={(value) => updateHp(value)}
              max={max}
              accessibilityLabel={`${playerName} current HP`}
              style={[styles.valueInput, styles.currentInput, isLowHp && styles.currentInputLow]}
            />
            <Text variant="codeMd" style={styles.separator}>
              /
            </Text>
            <EditableNumberInput
              value={max}
              onCommit={(value) => updateHp(current, value)}
              min={1}
              accessibilityLabel={`${playerName} max HP`}
              style={[styles.valueInput, styles.maxInput]}
            />
          </View>

          <Pressable
            style={[styles.stepperButton, !canIncrease && styles.stepperButtonDisabled]}
            onPress={() => adjustCurrent(1)}
            disabled={!canIncrease}
            accessibilityRole="button"
            accessibilityLabel={`Increase ${playerName} HP by 1`}
          >
            <Text style={styles.stepperButtonLabel}>+</Text>
          </Pressable>
        </View>

        <View style={styles.barTrack}>
          <View
            style={[styles.barFill, isLowHp && styles.barFillLow, { width: `${hpPercent}%` }]}
          />
        </View>
      </View>
    </View>
  );
};
