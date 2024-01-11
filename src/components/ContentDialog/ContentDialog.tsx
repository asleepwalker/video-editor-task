import React, { ChangeEvent, FC, useCallback, useState } from 'react';

import { Content } from '../../models/content';
import Dialog from '../Dialog/Dialog';
import Time from '../Time/Time';
import { ContentDialogProps } from './ContentDialog.interface';

import styles from './ContentDialog.module.css';

const ContentDialog: FC<ContentDialogProps> = ({ data, onChange, onClose }) => {
  const [newData, setNewData] = useState<Content[]>(data);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewData(data => data.map(
      item => item.id === event.target.name
        ? { ...item, active: event.target.checked }
        : item
    ));
  }, []);

  const handleSubmit = useCallback(() => {
    onChange(newData);
    onClose();
  }, [newData, onChange, onClose]);

  return (
    <Dialog title="Edit Content" action="Apply" onClose={onClose} onSubmit={handleSubmit}>
      {newData.map(item => (
        <label className={styles.item} key={item.id}>
          <div><input type="checkbox" name={item.id} checked={item.active} onChange={handleChange} /></div>
          <Time value={item.start} />
          <div>{item.text}</div>
        </label>
      ))}
    </Dialog>
  );
};

export default ContentDialog;
