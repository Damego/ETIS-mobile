import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { parseAnnounce } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import AnnounceCard from './AnnounceCard';

export default function Announce() {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [pageCount, setPageCount] = useState();
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const loadData = async () => {
    const html = await httpClient.getAnnounce();

    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    const parsedData = parseAnnounce(html);
    setPageCount(Math.ceil(parsedData.length / 5));
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filterData = (el, index) => index < currentPageNum * 5 && index >= (currentPageNum - 1) * 5;

  const changePage = (pageNum) => {
    setCurrentPageNum(pageNum);
  };

  if (!data) return <LoadingScreen />;

  return (
    <Screen onUpdate={loadData}>
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
