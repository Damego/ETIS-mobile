import { useRef } from 'react';

import { useClient } from '../data/client';
import { GetResultType, RequestType } from '../models/results';
import { setMessageCount } from '../redux/reducers/studentSlice';
import { useAppDispatch } from './redux';
import useQuery from './useQuery';

const useMessagesQuery = () => {
  const dispatch = useAppDispatch();
  const fetchedPages = useRef<number[]>([]);
  const client = useClient();

  const { data, isLoading, refresh, update } = useQuery({
    method: client.getMessagesData,
    after: (result) => {
      if (!fetchedPages.current.includes(result.data.page)) {
        fetchedPages.current.push(result.data.page);
      }
      if (result.data && result.type === GetResultType.fetched) {
        dispatch(setMessageCount(null));
      }
    },
  });

  const loadPage = (page: number) => {
    update({
      data: page,
      requestType: fetchedPages.current.includes(page)
        ? RequestType.tryCache
        : RequestType.tryFetch,
    });
  };

  return { data, isLoading, refresh, loadPage };
};

export default useMessagesQuery;
