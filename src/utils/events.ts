export const isHalloween = () => {
  return true;
  const currentDate = Date.now();
  const year = new Date().getFullYear();

  const startDate = new Date(year, 9, 28).getTime();
  const endDate = new Date(year, 10, 4).getTime();
  return currentDate > startDate && currentDate < endDate;
};

export const halloweenEmptyDayResponses = [
  'Баллы или жизнь? 💯',
  'Охота на призраков 👻',
  'Прятки с призраками 👻',
  '🎃',
  '👻',
  '🕷',
  '🕸',
  'Отмечаем хэллоуин 🎃',
];
