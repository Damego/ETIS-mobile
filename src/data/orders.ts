import { emptyResult, IGetPayload, IGetResult } from '../models/results';
import { httpClient, storage } from '../utils';
import { isLoginPage } from '../parser/utils';
import parseOrders from '../parser/order';
import { IOrder } from '../models/order';

export const getCachedOrders = async (): Promise<IGetResult<IOrder[]>> => {
  console.log('[DATA] Use cached orders data');
  return {
    ...emptyResult,
    data: await storage.getOrdersData(),
  };
}

export const getOrdersData = async (payload: IGetPayload): Promise<IGetResult<IOrder[]>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedOrders();
    if (result.data) return result
  }

  const html = await httpClient.getOrders();

  if (!html) {
    if (payload.useCache) return await getCachedOrders();
    return emptyResult;
  }

  if (isLoginPage(html)) return { ...emptyResult, isLoginPage: true };

  const data = parseOrders(html);
  console.log('[DATA] Fetched orders data');
  cacheOrdersData(data);

  return {
    data,
    isLoginPage: false,
    fetched: true
  }
}

export const cacheOrdersData = (data: IOrder[]) => {
  console.log('[DATA] Caching orders data...');

  storage.storeOrdersData(data);
}

export const getOrderHTML = async (order: IOrder) => {
  const cached = await storage.getOrderHTML(order.id);
  if (cached) {
    console.log('[DATA] Use cached order html');
    return cached;
  }

  const fetched = await httpClient.request(`/${order.uri}`);

  console.log("[DATA] fetched order html");

  storage.storeOrderHTML(order.id, fetched);

  console.log("[DATA] cached order html");

  return fetched;
}