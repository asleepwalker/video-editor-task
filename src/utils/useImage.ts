import { useEffect, useState } from 'react';

const useImage = (path: string): ImageBitmap | undefined => {
  const [data, setData] = useState<ImageBitmap>();

  useEffect(() => {
    fetch(path)
      .then(response => response.blob())
      .then(data => createImageBitmap(data))
      .then(image => setData(image))
      .catch(error => console.error('Error fetching the image:', error));
  }, [path]);

  return data;
};

export default useImage;
