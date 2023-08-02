import { GetResultType, IGetResult } from '../models/results';
import { storage } from '../utils';
import { ITimeTable } from '../models/timeTable';
import { IMessagesData } from '../models/messages';

export default class Cache {
  async getAnnounceData() {
    console.log('[DATA] Using cached announce data');

    return this.toResult(await storage.getAnnounceData());
  }

  placeAnnounceData(data: string[]) {
    console.log('[DATA] Caching announce data...');

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

  async getCachedMessagesData(page: number): Promise<IGetResult<IMessagesData>> {
    console.log(`[DATA] use cached messages for ${page} page`);

    return this.toResult(await storage.getMessages(page));
  }

  placeMessagesData(data: IMessagesData) {
    console.log(`[DATA] Caching messages for ${data.page} page`);
    storage.storeMessages(data);
  }

  private toResult<T>(data: T): IGetResult<T> {
    return {
      type: GetResultType.cached,
      data,
    };
  }
}
