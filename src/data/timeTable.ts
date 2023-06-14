import { IGetResult, emptyResult } from '../models/results';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { parseTimeTable } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';
import { HTTPError } from '../utils/http';

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

  let response;
  if (week !== null) {
    response = await httpClient.getTimeTable({ week });
  } else {
    response = await httpClient.getTimeTable();
  }

  if ((response as HTTPError).error || !response) {
    if (!useCache) return emptyResult;
    return await getCachedTimeTable(week);
  }

  if (isLoginPage(response)) {
    return { data: null, isLoginPage: true, fetched: false };
  }

  console.log(`[DATA] Fetched timetable for week ${week}`);
  return {
    data: parseTimeTable(response),
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheTimeTableData = async (data: ITimeTable, week?: number) => {
  console.log(`[DATA] Cached timetable for week ${week}`);
  await storage.storeTimeTableData(data, week);
};
