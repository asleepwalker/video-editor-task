const renderWatermark = (canvas: HTMLCanvasElement, watermark: ImageBitmap) => {
  const context = canvas.getContext('2d')!;
  context.drawImage(watermark, 20, 20, watermark.width / 2, watermark.height / 2);
};

export default renderWatermark;
