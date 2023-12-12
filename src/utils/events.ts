import { ThemeType } from '../styles/themes';

export interface EventData {
  suggestedTheme: boolean;
  previousTheme: ThemeType;
}

export interface Events {
  halloween2023?: EventData;
  newYear2024?: EventData;
}

const isInDateRange = (startDate: Date, endDate: Date) => {
  const currentDateTime = Date.now();
  const stateDateTime = startDate.getTime();
  const endDateTime = endDate.getTime();

  return currentDateTime > stateDateTime && currentDateTime < endDateTime;
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
  const endDate = new Date(year + 1, 0, 15);

  return isInDateRange(startDate, endDate);
};

export const newYearEmptyDayResponse = [
  'Едим мандарины 🍊',
  'Наряжаем ёлку 🎄',
  'Пишем Деду Морозу 🎅',
  'Ловим снежинки ❄️',
  'Лепим снеговика ☃️',
  '🍊',
  '🎄',
  '🎅',
  '❄️',
  '☃️',
];
