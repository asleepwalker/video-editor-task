import React, { FC, useCallback } from 'react';
import { VideoSeekSlider } from 'react-video-seek-slider';

import { SliderProps } from './Slider.interface';

import 'react-video-seek-slider/styles.css';
import styles from './Slider.module.css';

const Slider: FC<SliderProps> = ({ value, total, onChange }) => {
  const handleChange = useCallback((value: number) => onChange(value / 1000), [onChange]);

  return (
    <div className={styles.container}>
      <VideoSeekSlider currentTime={value * 1000} max={total * 1000} onChange={handleChange} />
    </div>
  );
}

export default Slider;
