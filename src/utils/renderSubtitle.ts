import { Content } from '../models/content';

const fontSize = 24;
const backgroundPadding = 8;

const renderSubtitle = (canvas: HTMLCanvasElement, subtitle: Content) => {
  const context = canvas.getContext('2d')!;
  const textX = canvas.width / 2;
  const textY = canvas.height - 40;
  const backgroundWidth = context.measureText(subtitle.text).width + (backgroundPadding * 2);
  const backgroundHeight = fontSize + (backgroundPadding * 2);
  const backgroundX = textX - (backgroundWidth / 2);
  const backgroundY = textY - (backgroundHeight / 2);

  context.fillStyle = 'rgba(0, 0, 0, 0.75)';
  context.fillRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight);

  context.font = `${fontSize}px sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'white';
  context.fillText(subtitle.text, textX, textY);
};

export default renderSubtitle;
