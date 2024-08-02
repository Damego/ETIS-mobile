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

export const formatCheckPointScore = (checkPoint: ICheckPoint) => {
  if (checkPoint.isAbsent) return 'н';
  if (Number.isNaN(checkPoint.points) || !checkPoint.points) return '-';
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

export const disciplineTypeNames: { [key in LessonTypes]: string } = {
  LECTURE: 'Лекция',
  PRACTICE: 'Практика',
  LABORATORY: 'Лабораторная',
  TEST: 'Зачёт',
  EXAM: 'Экзамен',
};

export const getDisciplineTypeName = (type: string): string => disciplineTypeNames[type] || type;

export const formatAudience = (lesson: ILesson) => {
  const { audience } = lesson;

  if (lesson.isDistance) return 'Дистанционно';

  return audience.number && audience.building && audience.floor
    ? `ауд. ${audience.number} (${audience.building} корпус, ${audience.floor} этаж)`
    : audience.string;
};

export const formatGroups = (groups: string[]) => {
  let str = "";
  groups.forEach((group, ind) => {
    str += group;
    if (ind !== groups.length - 1) {
      str += " • ";
    }
  })

  return str;
}

export const capitalizeWord = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
