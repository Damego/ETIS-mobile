import React, { useState } from 'react';
import { View } from 'react-native';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import PageNavigator from '~/components/PageNavigator';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import { useAppDispatch } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { GetResultType } from '~/models/results';
import { setAnnounceCount } from '~/redux/reducers/studentSlice';

import AnnounceCard from './AnnounceCard';

export default function Announce() {
  const dispatch = useAppDispatch();
  const [pageCount, setPageCount] = useState<number>();
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getAnnounceData,
    after: (result) => {
      // WebView сильно нагружает устройство, поэтому распределяем их по страницам
      setPageCount(Math.ceil(result.data.length / 5));

      if (result.data && result.type === GetResultType.fetched) {
        dispatch(setAnnounceCount(null));
      }
    },
  });

  const filterData = (el: string, index: number) =>
    index < currentPageNum * 5 && index >= (currentPageNum - 1) * 5;

  const changePage = (pageNum: number) => setCurrentPageNum(pageNum);

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      <View style={{ marginBottom: '2%' }}>
        <PageNavigator
          firstPage={1}
          currentPage={currentPageNum}
          lastPage={pageCount}
          onPageChange={changePage}
        />
      </View>

      {data.filter(filterData).map((message, i) => (
        <AnnounceCard data={message} key={`card-${i}`} />
      ))}
    </Screen>
  );
}
