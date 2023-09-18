import { useRef } from 'react';

import { cache } from '../cache/smartCache';
import { useClient } from '../data/client';
import { RequestType } from '../models/results';
import useQuery from './useQuery';

const useRatingQuery = () => {
  const fetchedFirstTime = useRef<boolean>(false);
  const client = useClient();
  const { data, isLoading, refresh, update } = useQuery({
    method: client.getRatingData,
    payload: {
      requestType: RequestType.tryFetch,
    },
    onFail: async () => {
      const student = await cache.getStudent();
      if (!student || !student.currentSession) return;

      update({
        requestType: RequestType.forceCache,
        data: student.currentSession,
      });
    },
    after: () => {
      if (!fetchedFirstTime.current) {
        fetchedFirstTime.current = true;
      }
    },
  });

  const loadSession = (session: number) => {
    update({
      requestType: fetchedFirstTime.current ? RequestType.tryCache : RequestType.tryFetch,
      data: session,
    });
  };

  return { data, isLoading, refresh, loadSession };
};

export default useRatingQuery;
