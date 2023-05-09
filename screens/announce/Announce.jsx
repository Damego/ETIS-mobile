import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { httpClient, parser } from '../../utils';
import AnnounceCard from './AnnounceCard';

export default function Announce() {
  const [data, setData] = useState();

  const loadData = async () => {
    const html = await httpClient.getAnnounce();
    const parsedData = parser.parseAnnounce(html);
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText={"Объявления"}/>;

  return (
    <Screen headerText={'Объявления'} onUpdate={loadData}>
      {data.map((message, i) => (
        <AnnounceCard data={message} key={`card-${i}`} />
      ))}
    </Screen>
  );
}
