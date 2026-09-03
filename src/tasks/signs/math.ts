import { ISubjectPoints } from '~/models/sessionPoints';

import { IDifferentCheckPoint } from './types';

export const differenceSigns = (marks1: ISubjectPoints[], marks2: ISubjectPoints[]): IDifferentCheckPoint[] => {
  if (marks1.length !== marks2.length) {
    return [];
  }

  return marks2
    .map((newRes) => {
      const oldRes = marks1.find((subject) => subject.name === newRes.name);
      if (newRes.checkPoints.length !== oldRes?.checkPoints.length) return [];

      const diffCheckPoints: IDifferentCheckPoint[] = newRes.checkPoints
        .map((checkPoint, i) => {
          if (checkPoint.points !== oldRes.checkPoints[i].points) {
            return {
              newResult: checkPoint,
              oldResult: oldRes.checkPoints[i],
              subjectName: newRes.name,
            };
          }
          return null;
        })
        .filter((s) => s !== null);

      return diffCheckPoints;
    })
    .filter((s) => s.length !== 0)
    .flat();
};
