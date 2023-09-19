import { useRef } from 'react';

import { cache } from '../cache/smartCache';
import { useClient } from '../data/client';
import { composePointsAndMarks } from '../data/signs';
import { useAppDispatch, useAppSelector } from '../hooks';
import useQuery from '../hooks/useQuery';
import { GetResultType, IGetResult, RequestType } from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { setCurrentSession } from '../redux/reducers/studentSlice';

const useSignsQuery = () => {
  const fetchedSessions = useRef<number[]>([]);
  const dispatch = useAppDispatch();
  const sessionsMarks = useRef<ISessionMarks[]>([]);
  const { currentSession } = useAppSelector((state) => state.student);
  const client = useClient();

  const { data, isLoading, update, refresh } = useQuery({
    method: client.getSessionSignsData,
    after: async (result) => {
      // Очевидно, что в самом начале мы получаем текущую сессию
      const currentSession = result.data.currentSession;
      if (!data) {
        dispatch(setCurrentSession(currentSession));

        if (result.type === GetResultType.fetched) {
          cache.placePartialStudent({ currentSession });
        }
      }

      if (!fetchedSessions.current.includes(currentSession)) {
        fetchedSessions.current.push(currentSession);
      }

      // oh dear...
      let marksResult: IGetResult<ISessionMarks[]>;
      if (sessionsMarks.current.length === 0) {
        marksResult = await client.getSessionMarksData({ requestType: RequestType.tryFetch });

        if (marksResult.data) {
          sessionsMarks.current = marksResult.data;
        }
      }

      result.data = composePointsAndMarks(
        result.data,
        sessionsMarks.current.length !== 0 ? sessionsMarks.current : marksResult.data
      );
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
  const loadSession = (session: number) => {
    update({
      data: session,
      requestType:
        session < currentSession || fetchedSessions.current.includes(session)
          ? RequestType.tryCache
          : RequestType.tryFetch,
    });
  };

  return { data, isLoading, refresh, loadSession };
};

export default useSignsQuery;
