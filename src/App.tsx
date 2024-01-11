import React, { FC, useEffect } from 'react';

import ContentDialog from './components/ContentDialog/ContentDialog';
import ExportDialog from './components/ExportDialog/ExportDialog';
import Loader from './components/Loader/Loader';
import Preview from './components/Preview/Preview';
import useContent from './utils/useContent';
import useImage from './utils/useImage';
import useSource from './utils/useSource';
import useToggle from './utils/useToggle';

import './App.css';

const App: FC = () => {
  const source = useSource('source.mp4');
  const [content, handleChange] = useContent('subtitles.srt');
  const thumbnail = useImage('thumbnail.jpg');
  const watermark = useImage('watermark.png');
  const isReady = source && content && thumbnail && watermark;

  const [isPlaying, handlePlay, handlePause] = useToggle(false);
  const [isEditing, handleOpenEditor, handleCloseEditor] = useToggle(false);
  const [isExporting, handleOpenExporter, handleCloseExporter] = useToggle(false);

  useEffect(() => {
    if (isPlaying && (isEditing || isExporting)) handlePause();
  }, [isPlaying, isEditing, isExporting, handlePause]);

  return (
    <div className="App">
      {isReady ? (
        <>
          <Preview
            source={source}
            content={content}
            thumbnail={thumbnail}
            watermark={watermark}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onEdit={handleOpenEditor}
            onExport={handleOpenExporter}
          />

          {isEditing && (
            <ContentDialog
              data={content}
              onChange={handleChange}
              onClose={handleCloseEditor}
            />
          )}

          {isExporting && (
            <ExportDialog
              source={source}
              content={content}
              watermark={watermark}
              onClose={handleCloseExporter}
            />
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default App;
