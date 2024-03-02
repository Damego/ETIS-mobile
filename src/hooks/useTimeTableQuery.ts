import { useRef } from 'react';

import { cache } from '../cache/smartCache';
import { useClient } from '../data/client';
import { GetResultType, RequestType } from '../models/results';
import { setCurrentWeek } from '../redux/reducers/studentSlice';
import { useAppDispatch, useAppSelector } from './redux';
import useQuery from './useQuery';

const useTimeTableQuery = () => {
  const dispatch = useAppDispatch();
  const client = useClient();
  const fetchedWeeks = useRef<number[]>([]);
  const { currentWeek } = useAppSelector((state) => state.student);

  const { data, isLoading, update, refresh } = useQuery({
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
    },
  });

  const loadWeek = (week: number) => {
    update({
      requestType:
        (data && week < currentWeek) || fetchedWeeks.current.includes(week)
          ? RequestType.tryCache
          : RequestType.tryFetch,
      data: week,
    });
  };

  return { data, isLoading, loadWeek, currentWeek, refresh };
};

export default useTimeTableQuery;
