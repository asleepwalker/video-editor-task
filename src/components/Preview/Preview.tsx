import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import adjustTime from '../../utils/adjustTime';
import getCurrentContent from '../../utils/getCurrentContent';
import renderFrame from '../../utils/renderFrame';
import renderThumbnail from '../../utils/renderThumbnail';
import Time from '../Time/Time';
import Slider from '../Slider/Slider';
import { PreviewProps } from './Preview.interface';

import styles from './Preview.module.css';

const Preview: FC<PreviewProps> = ({
  source,
  content,
  thumbnail,
  watermark,
  isPlaying,
  onPlay,
  onPause,
  onEdit,
  onExport,
}) => {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const blob = new Blob([source], { type: 'video/mp4' });
    video.current!.src = URL.createObjectURL(blob);
  }, [source]);

  const handleFrame = useCallback(() => {
    const subtitle = getCurrentContent(video.current!.currentTime, content);
    if (subtitle && !subtitle.active) video.current!.currentTime = subtitle.end + 1;
    else renderFrame(video.current!, canvas.current!, watermark, subtitle);
  }, [content, watermark]);

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(handleFrame);
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, handleFrame]);

  useEffect(() => {
    if (isPlaying && video.current!.paused) video.current!.play();
    else if (!isPlaying && !video.current!.paused) video.current!.pause();
  }, [isPlaying]);

  const handleLoadedMetadata = useCallback(() => {
    canvas.current!.width = video.current!.videoWidth;
    canvas.current!.height = video.current!.videoHeight;
    renderThumbnail(canvas.current!, thumbnail, watermark);
  }, [thumbnail, watermark]);

  const handleDurationChange = useCallback(() => {
    setDuration(adjustTime(video.current!.duration, content));
  }, [content]);

  const handleTimeUpdate = useCallback(() => {
    setTime(adjustTime(video.current!.currentTime, content));
    if (video.current!.paused) handleFrame();
  }, [content, handleFrame]);

  useEffect(() => {
    video.current!.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.current!.addEventListener('durationchange', handleDurationChange);
    video.current!.addEventListener('timeupdate', handleTimeUpdate);
    video.current!.addEventListener('play', onPlay);
    video.current!.addEventListener('pause', onPause);

    return () => {
      video.current!.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.current!.removeEventListener('durationchange', handleDurationChange);
      video.current!.removeEventListener('timeupdate', handleTimeUpdate);
      video.current!.removeEventListener('play', onPlay);
      video.current!.removeEventListener('pause', onPause);
    };
  }, [handleLoadedMetadata, handleDurationChange, handleTimeUpdate, onPlay, onPause]);

  const togglePlay = useCallback(() => {
    isPlaying ? onPause() : onPlay();
  }, [isPlaying, onPlay, onPause]);

  const handleJump = useCallback((time: number) => {
    video.current!.currentTime = adjustTime(time, content, true);
  }, [content]);

  useEffect(() => {
    // Reset player when content changes
    handleJump(0);
    handleDurationChange();
    setTimeout(() => renderThumbnail(canvas.current!, thumbnail, watermark), 100);
  }, [content, handleJump, handleDurationChange, thumbnail, watermark]);

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas} ref={canvas} onClick={togglePlay} />
      <video className={styles.video} ref={video} />
      {duration && (
        <div className={styles.controls}>
          <button className={styles.button} onClick={togglePlay} title={!isPlaying ? 'Play' : 'Pause'}>
            <span className="material-icons-sharp">{!isPlaying ? 'play_arrow' : 'pause'}</span>
          </button>
          <Time value={time} total={duration} />
          <Slider value={time} total={duration} onChange={handleJump} />
          <button className={styles.button} onClick={onEdit} title="Edit Content">
            <span className="material-icons-sharp">menu</span>
          </button>
          <button className={styles.button} onClick={onExport} title="Export Video">
            <span className="material-icons-sharp">download</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Preview;
