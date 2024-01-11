import { ReactNode } from 'react';

export interface DialogProps {
  title: string;
  action: string;
  submitting?: boolean;
  onSubmit: () => Promise<void> | void;
  onClose: () => void;
  children: ReactNode;
}
