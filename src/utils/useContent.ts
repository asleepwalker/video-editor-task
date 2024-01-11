import { useEffect, useState } from 'react';

import { Content } from '../models/content';
import parseSubtitles from './parseSubtitles';

const useContent = (path: string): [Content[] | undefined, (data: Content[]) => void] => {
  const [data, setData] = useState<Content[]>();

  useEffect(() => {
    fetch(path)
      .then(response => response.text())
      .then(data => setData(parseSubtitles(data)))
      .catch(error => console.error('Error fetching or parsing the subtitles:', error));
  }, [path]);

  return [data, setData];
};

export default useContent;
