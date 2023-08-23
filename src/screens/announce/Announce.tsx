import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { GetResultType, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { setAnnounceCount } from '../../redux/reducers/studentSlice';
import AnnounceCard from './AnnounceCard';

export default function Announce() {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const { announceCount } = useAppSelector((state) => state.student);
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState<string[]>();
  const [pageCount, setPageCount] = useState<number>();
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const client = getWrappedClient();

  const loadData = async (force?: boolean) => {
    setLoading(true);
    const result = await client.getAnnounceData({
      requestType: !force && announceCount === null ? RequestType.tryCache : RequestType.tryFetch,
    });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      if (!data) setLoading(false);
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setPageCount(Math.ceil(result.data.length / 5));
    setData(result.data);
    setLoading(false);
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

  if (isLoading) return <LoadingScreen onRefresh={loadData} />;
  if (!data) return <NoData onRefresh={() => loadData(true)} />;

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
