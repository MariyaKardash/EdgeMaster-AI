import { Text } from '@/components/atoms/text';
import type { StatusChipProps } from './status-chip.types';

export function StatusChip({ children }: StatusChipProps) {
  return <Text variant="statusChip">{children}</Text>;
}
