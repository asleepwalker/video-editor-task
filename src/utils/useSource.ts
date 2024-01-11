import { useEffect, useState } from 'react';

// TODO: Rename into useVideo and reuse for intro
const useSource = (path: string): ArrayBuffer | undefined => {
  const [data, setData] = useState<ArrayBuffer>();

  useEffect(() => {
    fetch(path)
      .then(response => response.arrayBuffer())
      .then(setData)
      .catch(error => console.error('Error fetching the video:', error));
  }, [path]);

  return data;
};

export default useSource;
