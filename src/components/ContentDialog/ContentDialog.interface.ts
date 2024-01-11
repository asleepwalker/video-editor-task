import { Content } from '../../models/content';

export interface ContentDialogProps {
  data: Content[];
  onChange: (data: Content[]) => void;
  onClose: () => void;
}
