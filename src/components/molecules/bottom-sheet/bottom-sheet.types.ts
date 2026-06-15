import type { ReactNode } from 'react';

export type BottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
  title?: string;
};
