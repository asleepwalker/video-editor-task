import React, { FC, useCallback, useState } from 'react';

import exportVideo from '../../utils/exportVideo';
import Dialog from '../Dialog/Dialog';
import { ExportDialogProps } from './ExportDialog.interface';

import styles from './ExportDialog.module.css';

const ExportDialog: FC<ExportDialogProps> = ({ source, content, watermark, onClose }) => {
  const [progress, setProgress] = useState(0);

  const handleExport = useCallback(() => {
    exportVideo(source, content, watermark, setProgress);
  }, [source, content, watermark]);



  return (
    <Dialog title="Export Video" action="Export" submitting={progress > 0} onClose={onClose} onSubmit={handleExport}>
      {progress ? (
        <div className={styles.progressBar}>
          <div className={styles.progressValue} style={{ width: `${progress * 100}%` }} />
        </div>
      ) : (
        <div className={styles.placeholder}>[Work in progress]</div>
      )}
    </Dialog>
  );
};

export default ExportDialog;
