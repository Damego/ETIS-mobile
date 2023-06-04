import { emptyResult, IGetPayload, IGetResult } from '../models/results';
import { httpClient, storage } from '../utils';
import { ISessionTeachPlan } from '../models/teachPlan';
import { isLoginPage } from '../parser/utils';
import { parseShortTeachPlan } from '../parser';

export const getCachedTeachPlanData = async (): Promise<IGetResult<ISessionTeachPlan[]>> => {
  console.log('[DATA] Use cached teach plan');

  return {
    ...emptyResult,
    data: await storage.getTeachPlan()
  }
}

export const getTeachPlanData = async (payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedTeachPlanData();
    if (result.data) return result;
  }

  const html = await httpClient.getTeachPlan();
  if (!html) {
    if (!payload.useCache) return emptyResult;
    return await getCachedTeachPlanData();
  }

  if (isLoginPage(html)) {
    return {...emptyResult, isLoginPage: true}
  }

  console.log('[DATA] Fetched teach plan data');

  const data = parseShortTeachPlan(html);

  return {
    data,
    isLoginPage: false,
    fetched: true
  }
}

export const cacheTeachPlanData = (data: ISessionTeachPlan[]) => {
  console.log('[DATA] Caching teach plan data...')
  return storage.storeTeachPlan(data)
}