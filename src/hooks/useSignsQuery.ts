import { useEffect, useRef, useState } from 'react';
import { cache } from '~/cache/smartCache';
import { useClient } from '~/data/client';
import { composePointsAndMarks } from '~/data/signs';
import { GetResultType, RequestType } from '~/models/results';
import { ISessionPoints } from '~/models/sessionPoints';
import { setCurrentSession } from '~/redux/reducers/studentSlice';

import { useAppDispatch, useAppSelector } from './redux';
import useQuery from './useQuery';

const useSignsQuery = () => {
  const fetchedSessions = useRef<number[]>([]);
  const dispatch = useAppDispatch();
  const { currentSession } = useAppSelector((state) => state.student);
  const client = useClient();
  const [data, setData] = useState<ISessionPoints>(null);
  const [isLoading, setLoading] = useState(true);

  const {
    data: pointsData,
    isLoading: isPointsLoading,
    update,
    refresh,
  } = useQuery({
    method: client.getSessionSignsData,
    after: async (result) => {
      // Очевидно, что в самом начале мы получаем текущую сессию
      const { currentSession } = result.data;
      if (!pointsData) {
        dispatch(setCurrentSession(currentSession));

        if (result.type === GetResultType.fetched) {
          cache.placePartialStudent({ currentSession });
        }
      }

      if (!fetchedSessions.current.includes(currentSession)) {
        fetchedSessions.current.push(currentSession);
      }
    },
    onFail: async () => {
      const student = await cache.getStudent();
      if (!student || !student.currentSession) return;
      update({
        requestType: RequestType.forceCache,
        data: student.currentSession,
      });
    },
  });

  const marksQuery = useQuery({
    method: client.getSessionMarksData,
  });

  useEffect(() => {
    if (pointsData && marksQuery.data) setData(composePointsAndMarks(pointsData, marksQuery.data));
  }, [pointsData, marksQuery.data]);

  useEffect(() => {
    setLoading(isPointsLoading && marksQuery.isLoading);
  }, [isPointsLoading, marksQuery.isLoading]);

  const loadSession = (session: number) => {
    const hasDuty = marksQuery.data.find(
      (sessionMarks) =>
        sessionMarks.session === session &&
        !!sessionMarks.disciplines.find((discipline) => ['2', 'незачет'].includes(discipline.mark))
    );

    update({
      data: session,
      requestType:
        (session < currentSession || fetchedSessions.current.includes(session)) && !hasDuty
          ? RequestType.tryCache
          : RequestType.tryFetch,
    });
  };

  return { data, isLoading, refresh, loadSession };
};

export default useSignsQuery;
