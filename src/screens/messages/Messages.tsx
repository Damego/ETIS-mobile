import React, { useRef } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useAppDispatch } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { GetResultType, RequestType } from '../../models/results';
import { setMessageCount } from '../../redux/reducers/studentSlice';
import MessagePreview from './MessagePreview';

const Messages = () => {
  const dispatch = useAppDispatch();
  const fetchedPages = useRef<number[]>([]);
  const client = useClient();
  const { data, isLoading, refresh, update } = useQuery({
    method: client.getMessagesData,
    payload: {
      requestType: RequestType.tryFetch,
    },
    after: (result) => {
      if (!fetchedPages.current.includes(result.data.page)) {
        fetchedPages.current.push(result.data.page);
      }

      if (result.data && result.type == GetResultType.fetched) {
        dispatch(setMessageCount(null));
      }
    },
  });
  const updateData = (page: number) => {
    update({
      data: page,
      requestType: fetchedPages.current.includes(page)
        ? RequestType.forceCache
        : RequestType.forceFetch,
    });
  };

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      <PageNavigator
        firstPage={1}
        lastPage={data.lastPage}
        currentPage={data.page}
        onPageChange={updateData}
      />

      {data.messages.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time} page={data.page} />
      ))}
    </Screen>
  );
};

export default Messages;
