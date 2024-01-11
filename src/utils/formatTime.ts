const padTime = (value: number) => value.toString().padStart(2, '0');

const formatTime = (value: number): string => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${padTime(minutes)}:${padTime(seconds)}`;
};

export default formatTime;
