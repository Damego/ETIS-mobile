export const getPointsWord = (points: number) => {
  let pointsWord = 'балл';

  let numEnd: number;
  if (points % 1 !== 0) numEnd = (points % 1) * 10;
  else numEnd = points % 10;
  numEnd = parseInt(numEnd.toFixed(0));

  if ([0, 5, 6, 7, 8, 9].includes(numEnd) || (points > 10 && points < 15)) pointsWord += 'ов';
  else if ([2, 3, 4].includes(numEnd)) pointsWord += 'а';

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
