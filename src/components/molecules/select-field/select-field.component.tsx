import { BottomSheetModal, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { BottomSheet } from '@/components/molecules/bottom-sheet';
import { styles } from './select-field.styles';
import type { SelectFieldOption, SelectFieldProps } from './select-field.types';

const normalizeOptions = (options: SelectFieldProps['options']): SelectFieldOption[] => {
  return options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  );
};

export const SelectField = ({
  value,
  options,
  placeholder = 'Select...',
  sheetTitle,
  onValueChange,
  triggerStyle,
  labelStyle,
  disabled = false,
}: SelectFieldProps) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const selectedOption = normalizedOptions.find((option) => option.value === value);

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    sheetRef.current?.present();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    sheetRef.current?.dismiss();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isOpen }}
        disabled={disabled}
        onPress={handleOpen}
        style={[styles.trigger, disabled && styles.triggerDisabled, triggerStyle]}
      >
        <Text
          variant="bodyMd"
          style={[
            styles.triggerLabel,
            !selectedOption && styles.triggerPlaceholder,
            ...(labelStyle ? [labelStyle] : []),
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Icon name="keyboard-arrow-down" size={20} color="onSurfaceVariant" />
      </Pressable>

      <BottomSheet ref={sheetRef} onClose={handleClose} title={sheetTitle ?? placeholder}>
        {normalizedOptions.map((option) => {
          const isSelected = option.value === value;

          return (
            <TouchableOpacity
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => handleSelect(option.value)}
            >
              <Text
                variant="bodyMd"
                style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
              >
                {option.label}
              </Text>
              {isSelected ? <Icon name="check" size={18} color="primary" /> : null}
            </TouchableOpacity>
          );
        })}
      </BottomSheet>
    </>
  );
};
