import { Content } from '../../models/content';

export interface ExportDialogProps {
  source: ArrayBuffer;
  content: Content[];
  watermark: ImageBitmap;
  onClose: () => void;
}
