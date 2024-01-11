import srtParser2 from 'srt-parser-2';

import { Content } from '../models/content';
import { Subtitle } from '../models/subtitles';

const parser = new srtParser2();

const parseSubtitles = (data: string): Content[] => {
  const subtitles = parser.fromSrt(data);

  return subtitles.map((item: Subtitle) => ({
    id: item.id,
    start: item.startSeconds,
    end: item.endSeconds,
    text: item.text,
    active: true,
  }));
};

export default parseSubtitles;
