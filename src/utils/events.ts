import { ThemeType } from '~/styles/themes';

export interface EventData {
  suggestedTheme: boolean;
  previousTheme: ThemeType;
}

export interface Events {
  halloween?: EventData;
  newYear?: EventData;
}

const isInDateRange = (startDate: Date, endDate: Date, checkCondition: 'and' | 'or' = 'and') => {
  const currentDateTime = Date.now();
  const stateDateTime = startDate.getTime();
  const endDateTime = endDate.getTime();

  if (checkCondition === 'and')
    return currentDateTime > stateDateTime && currentDateTime < endDateTime;

  // Применимо исключительно к промежутку, который начинается в одном году, а заканчивается в следующем
  if (checkCondition === 'or')
    return currentDateTime > stateDateTime || currentDateTime < endDateTime;
};

export const isHalloween = () => {
  const year = new Date().getFullYear();
  const startDate = new Date(year, 9, 28);
  const endDate = new Date(year, 10, 4);

  return isInDateRange(startDate, endDate);
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

export const isNewYear = () => {
  const year = new Date().getFullYear();
  const startDate = new Date(year, 11, 9);
  const endDate = new Date(year, 0, 15);
  // Новогоднее событие начинается в одном году,
  // а заканчивается в следующем,
  // поэтому проверяем только месяц и день, а значение года окончания события является текущим
  return isInDateRange(startDate, endDate, 'or');
};

export const newYearEmptyDayResponse = [
  'Едим мандарины 🍊',
  'Наряжаем ёлку 🎄',
  'Пишем Деду Морозу 🎅',
  'Ловим снежинки ❄️',
  'Лепим снеговика ☃️',
  'Отмечаем новый год🎉',
  'С новым годом 🎉',
  '🍊',
  '🎄',
  '🎅',
  '❄️',
  '☃️',
  '🎉',
];
