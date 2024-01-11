import React, { FC } from 'react';

import { DialogProps } from './Dialog.interface';

import styles from './Dialog.module.css';

const Dialog: FC<DialogProps> = ({ title, action, submitting, onClose, onSubmit, children }) => (
  <>
    <div className={styles.overlay} onClick={onClose} />
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{children}</div>
      <div className={styles.controls}>
        <button className={styles.cancel} onClick={onClose}>Cancel</button>
        <button className={styles.submit} onClick={onSubmit} disabled={submitting}>{action}</button>
      </div>
    </div>
  </>
);

export default Dialog;
