import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';

export const composePointsAndMarks = (
  sessionPoints: ISessionPoints,
  allSessionMarks: ISessionMarks[]
) => {
  if (!allSessionMarks || allSessionMarks.length === 0) return sessionPoints;

  const sessionMarks = allSessionMarks.find(
    (sessionData) => sessionData.session === sessionPoints.currentSession
  );

  if (sessionMarks) {
    sessionPoints.subjects.forEach((subject) => {
      const discipline = sessionMarks.disciplines.find(
        (discipline) => discipline.name === subject.name
      );
      if (discipline) subject.mark = discipline.mark;
    });
  }

  return sessionPoints;
};
