import React, { FC } from 'react';

import formatTime from '../../utils/formatTime';
import { TimeProps } from './Time.interface';

import styles from './Time.module.css';

const Time: FC<TimeProps> = ({ value, total }) => (
  <div className={styles.container}>
    {formatTime(value)} {total && `/ ${formatTime(total)}`}
  </div>
);

export default Time;
