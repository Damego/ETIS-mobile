import { IGetResult } from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionSignsData } from '../models/sessionPoints';
import { IGetSignsPayload } from '../models/signs';
import { parseSessionPoints } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';

export const composePointsAndMarks = (
  sessionPoints: ISessionSignsData,
  allSessionMarks: ISessionMarks[]
) => {
  if (!allSessionMarks || allSessionMarks.length === 0) return sessionPoints;

  const sessionMarks = allSessionMarks.find(
    (sessionData) => sessionData.fullSessionNumber === sessionPoints.currentSession
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

export const getCachedSignsData = async (
  session: number
): Promise<IGetResult<ISessionSignsData>> => {
  console.log(`[DATA] Use cached signs data for ${session} session`);
  return {
    ...emptyResult,
    data: await storage.getSignsData(session),
  };
};

export const getPartialSignsData = async (
  payload: IGetSignsPayload
): Promise<IGetResult<ISessionSignsData>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedSignsData(payload.session);
    if (result.data) return result;
  }

  const response = await httpClient.getSigns('current', payload.session);
  if (response.error || !response) {
    if (!payload.useCache) return emptyResult;
    return await getCachedSignsData(payload.session);
  }

  if (isLoginPage(response.data)) return { ...emptyResult, isLoginPage: true };

  console.log(`[DATA] Fetched session points for ${payload.session} session`);
  const data = parseSessionPoints(response.data);

  return {
    data,
    fetched: true,
    isLoginPage: false,
  };
};
