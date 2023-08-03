import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { IGetSignsPayload } from '../models/signs';
import { parseSessionMarks, parseSessionPoints } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';

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

export const getCachedSignsData = async (
  session: number
): Promise<IGetResult<ISessionPoints>> => {
  console.log(`[DATA] Use cached signs data for ${session} session`);
  return {
    ...emptyResult,
    data: await storage.getSignsData(session),
  };
};

export const getCachedMarksData = async (): Promise<IGetResult<ISessionMarks[]>> => {
  console.log(`[DATA] Using cached marks data`);
  return {
    ...emptyResult,
    data: await storage.getMarksData(),
  };
};

export const getPartialSignsData = async (
  payload: IGetSignsPayload
): Promise<IGetResult<ISessionPoints>> => {
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

export const getMarksData = async (payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedMarksData();
    if (result.data) return result;
  }

  const response = await httpClient.getSigns('session');
  if (response.error || !response) {
    if (!payload.useCache) return emptyResult;
    return await getCachedMarksData();
  }

  if (isLoginPage(response.data)) return { ...emptyResult, isLoginPage: true };

  console.log(`[DATA] Fetched marks data`);

  const data = parseSessionMarks(response.data);

  return {
    data,
    fetched: true,
    isLoginPage: false,
  };
};

export const cacheSignsData = (data: ISessionPoints, storeForUndefined?: boolean) => {
  console.log(`[DATA] caching signs data for ${data.currentSession} session`);
  storage.storeSignsData(data, storeForUndefined);
};

export const cacheMarksData = (data: ISessionMarks[]) => {
  console.log(`[DATA] caching marks data`);
  storage.storeMarksData(data);
};
