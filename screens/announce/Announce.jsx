import React, { useEffect, useState, useContext } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { httpClient, parser } from '../../utils';
import AnnounceCard from './AnnounceCard';
import AuthContext from '../../context/AuthContext';

export default function Announce() {
  const { toggleSignIn } = useContext(AuthContext);
  const [data, setData] = useState();
  const [pageCount, setPageCount] = useState();
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const loadData = async () => {
    const html = await httpClient.getAnnounce();

    if (!html) return;

    if (parser.isLoginPage(html)) {
      toggleSignIn();
      return;
    }

    const parsedData = parser.parseAnnounce(html);
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

  if (!data) return <LoadingScreen headerText={'Объявления'} />;

  return (
    <Screen headerText={'Объявления'} onUpdate={loadData}>
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
