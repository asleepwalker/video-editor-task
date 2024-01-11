import renderWatermark from './renderWatermark';

const renderThumbnail = (canvas: HTMLCanvasElement, thumbnail: ImageBitmap, watermark: ImageBitmap) => {
  const context = canvas.getContext('2d')!;
  context.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
  renderWatermark(canvas, watermark);
};

export default renderThumbnail;
