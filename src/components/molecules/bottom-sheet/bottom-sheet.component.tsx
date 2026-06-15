import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/text';
import { styles } from './bottom-sheet.styles';
import type { BottomSheetProps } from './bottom-sheet.types';

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(function BottomSheet(
  { onClose, children, title },
  ref,
) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['50%'], []);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
      bottomInset={insets.bottom}
    >
      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        {title ? (
          <View style={styles.header}>
            <Text variant="headlineMd" style={styles.title}>
              {title}
            </Text>
          </View>
        ) : null}

        <View style={styles.content}>{children}</View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
