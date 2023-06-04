import { IGetResult, emptyResult } from '../models/results';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { parseTimeTable } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';

export const getCachedTimeTable = async (week) => {
  console.log(`[DATA] Use cached timetable for week ${week}`);
  return {
    data: await storage.getTimeTableData(week),
    isLoginPage: false,
  };
};

export const getTimeTableData = async ({
  week,
  useCache,
  useCacheFirst,
}: ITimeTableGetProps): Promise<IGetResult<ITimeTable>> => {
  if (useCacheFirst) {
    const result = await getCachedTimeTable(week);
    if (result.data) return result;
  }

  let html: string;
  if (week !== null) {
    html = await httpClient.getTimeTable({ week });
  } else {
    html = await httpClient.getTimeTable();
  }

  if (!html) {
    if (!useCache) return emptyResult;
    return await getCachedTimeTable(week);
  }

  if (isLoginPage(html)) {
    return { data: null, isLoginPage: true, fetched: false };
  }

  console.log(`[DATA] Fetched timetable for week ${week}`);
  return {
    data: parseTimeTable(html),
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheTimeTableData = async (data: ITimeTable, week?: number) => {
  console.log(`[DATA] Cached timetable for week ${week}`);
  await storage.storeTimeTableData(data, week);
};
