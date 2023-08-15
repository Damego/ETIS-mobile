export const getPointsWord = (points: number) => {
  let pointsWord = 'балл';
  const mod10 = points % 10;
  if ([2, 3, 4].includes(mod10)) pointsWord += 'а';
  else if ([0, 5, 6, 7, 8, 9].includes(mod10)) pointsWord += 'ов';

  return pointsWord;
};

export const fontSize = {
  micro: {
    fontSize: 8,
  },
  mini: {
    fontSize: 12,
  },
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 20,
  },
  xlarge: {
    fontSize: 26,
  },
  xxlarge: {
    fontSize: 36,
  },
};
