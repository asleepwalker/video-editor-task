import { Content } from '../../models/content';

export interface PreviewProps {
  source: ArrayBuffer;
  content: Content[];
  thumbnail: ImageBitmap;
  watermark: ImageBitmap;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onEdit: () => void;
  onExport: () => void;
}
