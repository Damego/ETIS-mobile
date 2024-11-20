import React, { useState } from 'react';
import { View } from 'react-native';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import PageNavigator from '~/components/PageNavigator';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import { useAppDispatch } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { IAnnounce } from '~/models/announce';
import { GetResultType } from '~/models/results';
import { SceneProps } from '~/models/rn-tab-view';
import { setAnnounceCount } from '~/redux/reducers/studentSlice';
import AnnounceCard from '~/screens/etis/main/components/AnnounceCard';
import { MessagesShortcuts } from '~/screens/etis/main/components/MessagesShortcuts';

const PAGE_ITEMS_LENGTH = 5;

const Announces = ({ jumpTo, route }: SceneProps) => {
  const dispatch = useAppDispatch();
  const [pageCount, setPageCount] = useState<number>();
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getAnnounceData,
    after: (result) => {
      // WebView сильно нагружает устройство, поэтому распределяем объявления по страницам по 5 штук
      setPageCount(Math.ceil(result.data.length / PAGE_ITEMS_LENGTH));

      if (result.data && result.type === GetResultType.fetched) {
        dispatch(setAnnounceCount(null));
      }
    },
  });

  const filterData = (el: IAnnounce, index: number) =>
    index < currentPageNum * PAGE_ITEMS_LENGTH && index >= (currentPageNum - 1) * PAGE_ITEMS_LENGTH;

  const changePage = (pageNum: number) => setCurrentPageNum(pageNum);

  let component: React.ReactNode;
  if (isLoading) {
    component = <LoadingContainer />;
  } else if (!data) {
    component = <NoData />;
  } else {
    component = (
      <>
        <View style={{ marginBottom: '2%' }}>
          <PageNavigator
            firstPage={1}
            currentPage={currentPageNum}
            lastPage={pageCount}
            onPageChange={changePage}
          />
        </View>

        <View style={{ gap: 8 }}>
          {data.filter(filterData).map((announce, i) => (
            <AnnounceCard data={announce} key={i} />
          ))}
        </View>
      </>
    );
  }

  return (
    <Screen onUpdate={refresh}>
      <MessagesShortcuts onShortcutPress={jumpTo} currentShortcut={route.key} />
      {component}
    </Screen>
  );
};

export default Announces;
