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

    const timetableData = timetable.data;
    const currentWeek = timetableData?.weekInfo.selected;
    if (currentWeek && timetableData) {
      const { first, last } = timetableData.weekInfo;
      if (cachedStudent?.firstWeek !== undefined && cachedStudent.firstWeek !== first) {
        await cache.clearTimeTable();
        await cache.placeTimeTable(timetableData);
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
    console.warn('[PREFETCH] Failed:', String(error instanceof Error ? error.message : error));
  }
};

export default prefetch;
