import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { parseMenu } from '../parser';
import { httpClient, storage } from '../utils';
import { StudentData } from '../models/student';
import { MenuParseResult } from '../parser/menu';
import { HTTPError } from '../utils/http';

export const getCachedStudentData = async (): Promise<IGetResult<MenuParseResult>> => {
  console.log('[DATA] Using cached student data');

  const data: MenuParseResult = {
    announceCount: null,
    messageCount: null,
    studentInfo: await storage.getStudentData()
  }

  return {
    ...emptyResult,
    data
  };
};

export const getStudentData = async (payload: IGetPayload): Promise<IGetResult<MenuParseResult>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedStudentData();
    if (result.data.studentInfo) return result;
  }

  // Каждая страница содержит в себе информацию о студенте,
  // но страница с посещаюмостью содержит группу, в которой находится студент
  const response = await httpClient.getGroupJournal();

  if ((response as HTTPError).error || !response) {
    if (!payload.useCache) return emptyResult;
    return await getCachedStudentData();
  }

  console.log('[DATA] Fetched student data');

  const data = parseMenu(response, true);

  cacheStudentData(data.studentInfo);

  return {
    data,
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheStudentData = (data: StudentData) => {
  console.log('[DATA] Caching student data');
  storage.storeStudentData(data);
};
