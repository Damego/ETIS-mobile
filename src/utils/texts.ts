import { StyleSheet } from 'react-native';

import { LessonTypes } from '~/models/other';
import { ICheckPoint } from '~/models/sessionPoints';
import { ILesson } from '~/models/timeTable';

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

// Сокращённая подпись балла контрольной точки:
// 'н' — студент отсутствовал, '-' — балла нет, иначе — сам балл
export const formatCheckPointScore = (checkPoint: ICheckPoint): string | number => {
  if (checkPoint.isAbsent) return 'н';
  if (Number.isNaN(checkPoint.points) || !checkPoint.points) return '-';
  return checkPoint.points;
};

// todo: rename every size to character like format
export const fontSize = StyleSheet.create({
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
  big: {
    fontSize: 18,
  },
  large: {
    fontSize: 20,
  },
  slarge: {
    fontSize: 22,
  },
  mlarge: {
    fontSize: 24,
  },
  xlarge: {
    fontSize: 26,
  },
  xxlarge: {
    fontSize: 36,
  },
});

// Размеры иконок, применяемые по всему приложению.
// Обычная иконка в строке/кнопке — iconSize.medium,
// крупная в шапке экрана — iconSize.large
export const iconSize = {
  small: 20,
  medium: 24,
  large: 28,
};

// Радиусы скругления углов. small — бейджи/мелкие элементы,
// medium — карточки и инпуты, large — крупные блоки и модалки
export const borderRadius = {
  small: 5,
  medium: 10,
  large: 20,
};

export const disciplineTypeNames: { [key in LessonTypes]: string } = {
  LECTURE: 'Лекция',
  PRACTICE: 'Практика',
  LABORATORY: 'Лабораторная',
  TEST: 'Зачёт',
  EXAM: 'Экзамен',
};

export const getDisciplineTypeName = (type: string): string =>
  (disciplineTypeNames as Record<string, string>)[type] || type;

export const formatAudience = (lesson: ILesson) => {
  const { audience } = lesson;

  if (lesson.isDistance) {
    if (!lesson.distancePlatform) return 'Дистанционно';

    return lesson.distancePlatform.name;
  }

  if (!audience) return;

  return audience.number && audience.building && audience.floor
    ? `ауд. ${audience.number} (${audience.building} корпус, ${audience.floor} этаж)`
    : audience.string;
};

export const formatGroups = (groups: string[]) => {
  let str = '';
  groups.forEach((group, ind) => {
    str += group;
    if (ind !== groups.length - 1) {
      str += ' • ';
    }
  });

  return str;
};

export const capitalizeWord = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const getDisciplineTypeFromReporting = (reporting: string) =>
  ({
    Экзамен: LessonTypes.EXAM,
    Зачет: LessonTypes.TEST,
  })[reporting];
