import { Content } from '../models/content';

const getCurrentContent = (time: number, content: Content[]): Content | undefined =>
  content.find(item => time >= item.start && time <= item.end);

export default getCurrentContent;
