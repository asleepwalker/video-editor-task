import { Content } from '../models/content';

const adjustTime = (time: number, content: Content[], reverse = false): number => {
  if (!Number.isFinite(time)) return 0;
  const disabled = content.filter(item => time > item.start && !item.active);
  const skipped = disabled.reduce((acc, item) => acc + (item.end - item.start), 0);
  return time + (reverse ? skipped : -skipped);
};

export default adjustTime;
