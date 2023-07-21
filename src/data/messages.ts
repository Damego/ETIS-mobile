import { IGetMessagesPayload, IMessagesData } from '../models/messages';
import { emptyResult, IGetResult } from '../models/results';
import { httpClient, storage } from '../utils';
import { isLoginPage } from '../parser/utils';
import parseMessages from '../parser/messages';

export const getCachedMessagesData = async (page: number): Promise<IGetResult<IMessagesData>> => {
  console.log(`[DATA] use cached messages for ${page} page`);

  return {
    ...emptyResult,
    data: await storage.getMessages(page)
  }
}

export const getMessagesData = async (payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedMessagesData(payload.page);
    if (result.data) return result;
  }

  const response = await httpClient.getMessages(payload.page);

  if (response.error || !response) {
    if (payload.useCache) {
      return await getCachedMessagesData(payload.page);
    }
    return emptyResult;
  }

  if (isLoginPage(response.data)) {
    return {
      ...emptyResult,
      isLoginPage: true
    }
  }

  const data = parseMessages(response.data);

  console.log(`[DATA] Fetched messages for ${data.page} page`)

  cacheMessagesData(data);

  return {
    data,
    isLoginPage: false,
    fetched: true
  }
}

export const cacheMessagesData = (data: IMessagesData) => {
  console.log(`[DATA] Caching messages for ${data.page} page`);

  storage.storeMessages(data);
}