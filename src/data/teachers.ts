import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { TeacherType } from '../models/teachers';
import { parseTeachers } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';

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

  const html = await httpClient.getTeachers();
  if (!html) {
    if (!useCache) return emptyResult;
    return await getCachedTeacherData();
  }

  if (isLoginPage(html)) return { ...emptyResult, isLoginPage: true };

  const data = parseTeachers(html);

  console.log('[DATA] Fetched teacher data');
  return { data, fetched: true, isLoginPage: false };
};

export const cacheTeacherData = async (data: TeacherType) => {
  console.log('[DATA] Cached teacher data');

  await storage.storeTeacherData(data);
};
