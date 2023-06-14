import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { TeacherType } from '../models/teachers';
import { parseTeachers } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';
import { HTTPError } from '../utils/http';

type PromiseTeacherGetResult = Promise<IGetResult<TeacherType>>;

export const getCachedTeacherData = async (): PromiseTeacherGetResult => {
  console.log('[DATA] Use cached teachers');
  return {
    ...emptyResult,
    data: await storage.getTeacherData(),
  };
};

export const getTeacherData = async ({
  useCache,
  useCacheFirst,
}: IGetPayload): PromiseTeacherGetResult => {
  if (useCacheFirst) {
    const result = await getCachedTeacherData();
    if (result.data) return result;
  }

  const response = await httpClient.getTeachers();
  if ((response as HTTPError).error || !response) {
    if (!useCache) return emptyResult;
    return await getCachedTeacherData();
  }

  if (isLoginPage(response)) return { ...emptyResult, isLoginPage: true };

  const data = parseTeachers(response);

  console.log('[DATA] Fetched teacher data');
  return { data, fetched: true, isLoginPage: false };
};

export const cacheTeacherData = async (data: TeacherType) => {
  console.log('[DATA] Cached teacher data');

  await storage.storeTeacherData(data);
};
