import { cache } from '~/cache/smartCache';
import { BaseClient } from '~/data/base';
import { RequestType } from '~/models/results';

const prefetch = async (client: BaseClient) => {
  try {
    const cachedStudent = await cache.getStudent();
    const [timetable, signs] = await Promise.all([
      client.getTimeTableData({ requestType: RequestType.forceFetch }),
      client.getSessionSignsData({ requestType: RequestType.forceFetch }),
      client.getSessionMarksData({ requestType: RequestType.forceFetch }),
    ]);

    const currentWeek = timetable.data?.weekInfo.selected;
    if (currentWeek) {
      const { first, last } = timetable.data.weekInfo;
      if (cachedStudent?.firstWeek !== undefined && cachedStudent.firstWeek !== first) {
        await cache.clearTimeTable();
        await cache.placeTimeTable(timetable.data);
      }

      const adjacentWeeks = [currentWeek - 1, currentWeek + 1].filter(
        (week) => week >= first && week <= last
      );

      await adjacentWeeks.reduce(
        async (previousRequest, week) => {
          await previousRequest;
          await client.getTimeTableData({
            data: week,
            requestType: RequestType.forceFetch,
          });
        },
        Promise.resolve()
      );
      await cache.placePartialStudent({ currentWeek, firstWeek: first });
    }

    const currentSession = signs.data?.currentSession;
    if (currentSession) {
      await cache.placePartialStudent({ currentSession });
    }

    return { currentWeek, currentSession };
  } catch (error) {
    console.warn('[PREFETCH] Failed:', String(error?.message || error));
  }
};

export default prefetch;
