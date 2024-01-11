import { useCallback, useState } from 'react';

const useToggle = (initialState = false): [boolean, () => void, () => void] => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return [isOpen, handleOpen, handleClose];
};

export default useToggle;
