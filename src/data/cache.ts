import { GetResultType, IGetResult } from '../models/results';
import { storage } from '../utils';
import { ITimeTable } from '../models/timeTable';

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
  }

  private toResult<T>(data: T): IGetResult<T> {
    return {
      type: GetResultType.cached,
      data,
    };
  }
}
