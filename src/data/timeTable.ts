import { IGetResult, emptyResult } from '../models/results';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { parseTimeTable } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';
import { HTTPError } from '../utils/http';

export const getCachedTimeTable = async (week?: number) => {
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

  if (!response || response.error) {
    if (!useCache) return emptyResult;
    return await getCachedTimeTable(week);
  }

  if (isLoginPage(response.data)) {
    return { data: null, isLoginPage: true, fetched: false };
  }

  console.log(`[DATA] Fetched timetable for week ${week}`);

  const data = parseTimeTable(response.data)

  cacheTimeTableData(data)

  return {
    data,
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheTimeTableData = async (data: ITimeTable, week?: number) => {
  console.log(`[DATA] Caching timetable for week ${week || data.selectedWeek}`);
  await storage.storeTimeTableData(data, week || data.selectedWeek, !week);
};
