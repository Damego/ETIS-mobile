import { GetResultType, IGetResult } from '../models/results';
import { storage } from '../utils';
import { ITimeTable } from '../models/timeTable';
import { IMessagesData } from '../models/messages';
import { IOrder } from '../models/order';
import { IRating } from '../models/rating';
import { ISessionSignsData } from '../models/sessionPoints';
import { ISessionMarks } from '../models/sessionMarks';

export default class Cache {
  async getAnnounceData() {
    console.log('[CACHE] Using cached announce data');

    return this.toResult(await storage.getAnnounceData());
  }

  placeAnnounceData(data: string[]) {
    console.log('[CACHE] Caching announce data...');

    storage.storeAnnounceData(data);
  }

  async getTimeTableData(week: number) {
    console.log(`[CACHE] Get timetable data for ${week} week`);

    return this.toResult(await storage.getTimeTableData(week));
  }

  placeTimeTableData(data: ITimeTable) {
    console.log(`[CACHE] Cache timetable data for ${data.selectedWeek}`);
    storage.storeTimeTableData(data, data.selectedWeek);
  }

  async getMessagesData(page: number): Promise<IGetResult<IMessagesData>> {
    console.log(`[CACHE] use cached messages for ${page} page`);

    return this.toResult(await storage.getMessages(page));
  }

  placeMessagesData(data: IMessagesData) {
    console.log(`[CACHE] Caching messages for ${data.page} page`);
    storage.storeMessages(data);
  }

  async getOrderData() {
    console.log('[CACHE] Using cached order data');

    return this.toResult(await storage.getOrdersData());
  }

  placeOrderData(data: IOrder[]) {
    console.log('[CACHE] Caching order data...');
    storage.storeOrdersData(data);
  }

  async getRatingData(session: number) {
    console.log('[CACHE] Using cached rating data');
    return this.toResult(await storage.getRatingData(session));
  }

  placeRatingData(data: IRating) {
    console.log('[CACHE] Caching rating data...');
    storage.storeRatingData(data);
  }

  async getSignsData(session: number) {
    console.log('[CACHE] Using cached signs data');
    return this.toResult(await storage.getSignsData(session));
  }

  placeSignsData(data: ISessionSignsData, storeForUndefined?: boolean) {
    console.log(`[CACHE] caching signs data for ${data.currentSession} session`);
    storage.storeSignsData(data, storeForUndefined);
  }

  async getMarksData() {
    console.log('[CACHE] Using cached marks data');
    return this.toResult(await storage.getMarksData());
  }

  placeMarksData(data: ISessionMarks[]) {
    console.log(`[CACHE] caching marks data`);
    storage.storeMarksData(data);
  }

  private toResult<T>(data: T): IGetResult<T> {
    return {
      type: GetResultType.cached,
      data,
    };
  }
}
