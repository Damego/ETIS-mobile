import { useCallback, useRef } from 'react';
import { cache } from '~/cache/smartCache';
import { useClient } from '~/data/client';
import { GetResultType, IGetResult, RequestType } from '~/models/results';
import { ITimeTable } from '~/models/timeTable';
import { setCurrentWeek } from '~/redux/reducers/studentSlice';

import { useAppDispatch, useAppSelector } from './redux';
import useQuery from './useQuery';

const useTimeTableQuery = ({
  afterCallback,
  week,
}: {
  afterCallback?: (result: IGetResult<ITimeTable>) => void;
  week?: number;
}) => {
  const dispatch = useAppDispatch();
  const client = useClient();
  const fetchedWeeks = useRef<number[]>([]);
  const { currentWeek } = useAppSelector((state) => state.student);

  const { data, isLoading, update, refresh } = useQuery({
    payload: {
      data: week,
      requestType: RequestType.tryFetch,
    },
    method: client.getTimeTableData,
    onFail: async () => {
      const student = await cache.getStudent();
      if (!student || !student.currentWeek) return;

      update({
        requestType: RequestType.forceCache,
        data: student.currentWeek,
      });
    },
    after: async (result) => {
      const { first: firstWeek, selected: selectedWeek } = result.data.weekInfo;

      if (result.type !== GetResultType.cached) {
        const cachedStudent = await cache.getStudent();
        if (cachedStudent.firstWeek !== undefined && cachedStudent.firstWeek !== firstWeek) {
          // Начался новый период учёбы, кэшированные ранее недели больше не нужны.
          await cache.clearTimeTable();
          await cache.placePartialStudent({ firstWeek });
        }
      }
      if (!data) {
        dispatch(setCurrentWeek(selectedWeek));
        cache.placePartialStudent({ currentWeek: selectedWeek, firstWeek });
      }

      if (!fetchedWeeks.current.includes(selectedWeek)) {
        fetchedWeeks.current.push(selectedWeek);
      }
      afterCallback?.(result);
    },
  });

  const loadWeek = useCallback(
    (week: number) => {
      update({
        requestType:
          (data && week < currentWeek) || fetchedWeeks.current.includes(week)
            ? RequestType.tryCache
            : RequestType.tryFetch,
        data: week,
      });
    },
    [data, currentWeek, fetchedWeeks.current, update]
  );

  return {
    data,
    isLoading,
    loadWeek,
    currentWeek,
    refresh,
  };
};

export default useTimeTableQuery;
