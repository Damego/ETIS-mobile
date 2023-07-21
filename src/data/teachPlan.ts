import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { ISessionTeachPlan } from '../models/teachPlan';
import { parseShortTeachPlan } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';
import { HTTPError } from '../utils/http';

export const getCachedTeachPlanData = async (): Promise<IGetResult<ISessionTeachPlan[]>> => {
  console.log('[DATA] Use cached teach plan');

  return {
    ...emptyResult,
    data: await storage.getTeachPlan(),
  };
};

export const getTeachPlanData = async (
  payload: IGetPayload
): Promise<IGetResult<ISessionTeachPlan[]>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedTeachPlanData();
    if (result.data) return result;
  }

  const response = await httpClient.getTeachPlan();
  if (response.error || !response) {
    if (!payload.useCache) return emptyResult;
    return await getCachedTeachPlanData();
  }

  if (isLoginPage(response.data)) {
    return { ...emptyResult, isLoginPage: true };
  }

  console.log('[DATA] Fetched teach plan data');

  const data = parseShortTeachPlan(response.data);

  return {
    data,
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheTeachPlanData = (data: ISessionTeachPlan[]) => {
  console.log('[DATA] Caching teach plan data...');
  return storage.storeTeachPlan(data);
};
