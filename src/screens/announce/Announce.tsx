import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { cacheAnnounceData, getAnnounceData } from '../../data/announce';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { setAnnounceCount } from '../../redux/reducers/studentSlice';
import AnnounceCard from './AnnounceCard';

export default function Announce() {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const { announceCount } = useAppSelector((state) => state.student);

  const [data, setData] = useState<string[]>();
  const [pageCount, setPageCount] = useState<number>();
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const loadData = async (force?: boolean) => {
    const result = await getAnnounceData({
      useCache: true,
      useCacheFirst: !force && announceCount === null,
    });

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setPageCount(Math.ceil(result.data.length / 5));
    setData(result.data);

    if (result.fetched) {
      cacheAnnounceData(result.data);
    }
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  useEffect(() => {
    dispatch(setAnnounceCount(null));
  }, []);

  const filterData = (el: string, index: number) =>
    index < currentPageNum * 5 && index >= (currentPageNum - 1) * 5;

  const changePage = (pageNum) => {
    setCurrentPageNum(pageNum);
  };

  if (!data) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={() => loadData(true)}>
      <PageNavigator
        firstPage={1}
        currentPage={currentPageNum}
        lastPage={pageCount}
        onPageChange={changePage}
      />

      {data.filter(filterData).map((message, i) => (
        <AnnounceCard data={message} key={`card-${i}`} />
      ))}
    </Screen>
  );
}
