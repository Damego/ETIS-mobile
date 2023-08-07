import { IOrder } from '../models/order';
import { httpClient, storage } from '../utils';

export const getOrderHTML = async (order: IOrder): Promise<string> => {
  const cached = await storage.getOrderHTML(order.id);
  if (cached) {
    console.log('[DATA] Use cached order html');
    return cached;
  }

  const fetched = await httpClient.request('GET', `/${order.uri}`, { returnResponse: false });
  if (fetched.error) return;

  console.log('[DATA] fetched order html');

  storage.storeOrderHTML(order.id, fetched.data);

  console.log('[DATA] cached order html');

  return fetched.data as string;
};
