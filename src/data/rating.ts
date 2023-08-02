import { emptyResult, IGetPayload, IGetResult } from '../models/results';
import { httpClient, storage } from '../utils';
import { IRating } from '../models/rating';
import { isLoginPage } from '../parser/utils';
import parseRating from '../parser/rating';

interface IGetRatingPayload extends IGetPayload {
  session: number;
}

export const getCachedRatingData = async (session: number) => {
  console.log(`[DATA] Using cached rating for ${session} session`);

  return {
    ...emptyResult,
    data: await storage.getRatingData(session)
  }
}

export const getRatingData = async (payload: IGetRatingPayload): Promise<IGetResult<IRating>> => {
  console.log(`[DATA] Getting rating data for ${payload.session} session...`);

  if (payload.useCacheFirst) {
    const result = await getCachedRatingData(payload.session);
    if (result.data) return result;
  }

  const response = await httpClient.getSigns('rating', payload.session);
  if (response.error || !response) {
    if (!payload.useCache) return emptyResult;
    return await getCachedRatingData(payload.session);
  }

  if (isLoginPage(response.data)) return { ...emptyResult, isLoginPage: true };

  const data = parseRating(response.data);

  console.log(`[DATA] Fetched rating data for ${data.session.current} session`);

  console.log(`[DATA] Caching rating data for ${data.session.current} session...`)
  storage.storeRatingData(data);

  return {
    data,
    fetched: true,
    isLoginPage: false
  }

}