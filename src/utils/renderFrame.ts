import { Content } from '../models/content';
import renderWatermark from './renderWatermark';
import renderSubtitle from './renderSubtitle';

const renderFrame = (
  video: HTMLVideoElement | VideoFrame,
  canvas: HTMLCanvasElement,
  watermark: ImageBitmap,
  subtitle?: Content,
) => {
  const context = canvas.getContext('2d')!;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  if (subtitle) renderSubtitle(canvas, subtitle);
  renderWatermark(canvas, watermark);
};

export default renderFrame;
