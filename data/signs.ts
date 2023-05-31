import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionSignsData } from '../models/sessionPoints';
import { IGetSignsPayload } from '../models/signs';
import { parseSessionMarks, parseSessionPoints } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';

export const composePointsAndMarks = (
  sessionPoints: ISessionSignsData,
  allSessionMarks: ISessionMarks[]
) => {
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

export const getCachedMarksData = async (): Promise<IGetResult<ISessionMarks[]>> => {
  console.log(`[DATA] Using cached marks data`);
  return {
    ...emptyResult,
    data: await storage.getMarksData(),
  };
};

export const getPartialSignsData = async (
  payload: IGetSignsPayload
): Promise<IGetResult<ISessionSignsData>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedSignsData(payload.session);
    if (result.data) return result;
  }

  const html = await httpClient.getSigns('current', payload.session);
  if (!html) {
    if (!payload.useCache) return emptyResult;
    return await getCachedSignsData(payload.session);
  }

  if (isLoginPage(html)) return { ...emptyResult, isLoginPage: true };

  console.log(`[DATA] Fetched session points for ${payload.session} session`);
  const data = parseSessionPoints(html);

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

  const html = await httpClient.getSigns('session');
  if (!html) {
    if (!payload.useCache) return emptyResult;
    return await getCachedMarksData();
  }

  if (isLoginPage(html)) return { ...emptyResult, isLoginPage: true };

  console.log(`[DATA] Fetched marks data`);

  const data = parseSessionMarks(html);

  return {
    data,
    fetched: true,
    isLoginPage: false,
  };
};

export const cacheSignsData = (data: ISessionSignsData) => {
  console.log(`[DATA] caching signs data for ${data.currentSession} session`);
  storage.storeSignsData(data);
};

export const cacheMarksData = (data: ISessionMarks[]) => {
  console.log(`[DATA] caching marks data`);
  storage.storeMarksData(data);
};