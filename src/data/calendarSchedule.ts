import {emptyResult, IGetPayload, IGetResult} from "../models/results";
import {ICalendarSchedule} from "../models/calendarSchedule";
import {httpClient, storage} from "../utils";
import {isLoginPage} from "../parser/utils";
import parseCalendarSchedule from "../parser/calendar";

const getCachedCalendarSchedule = async (): Promise<IGetResult<ICalendarSchedule>> => {
  console.log("[DATA] Getting cached calendar schedule");
  
  return {
    ...emptyResult,
    data: await storage.getCalendarSchedule()
  }
}


export const getCalendarSchedule = async (payload: IGetPayload): Promise<IGetResult<ICalendarSchedule>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedCalendarSchedule();
    if (result.data) return result;
  }

  const response = await httpClient.getTeachPlan("advanced");

  if (response?.error) {
    if (payload.useCache) {
      return await getCachedCalendarSchedule();
    }
    return emptyResult;
  }

  if (isLoginPage(response.data)) {
    return {
      ...emptyResult,
      isLoginPage: true
    }
  }

  const data = parseCalendarSchedule(response.data);
  console.log("[DATA] Fetched advanced teach plan (calendar schedule)");

  console.log('[DATA] Caching calendar schedule...')
  storage.storeCalendarSchedule(data);

  return {
    data,
    fetched: true,
    isLoginPage: false,
  }
}