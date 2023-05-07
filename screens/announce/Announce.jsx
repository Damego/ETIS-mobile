import React, { useEffect, useState } from 'react';

import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { vars } from '../../utils/vars';
import AnnounceCard from './AnnounceCard';

export default function Announce() {
  const [data, setData] = useState();

  const loadData = async () => {
    const html = await vars.httpClient.getAnnounce();
    const parsedData = vars.parser.parseAnnounce(html);
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingPage />;

  return (
    <Screen headerText={'Объявления'} onUpdate={loadData}>
      {data.map((message, i) => (
        <AnnounceCard data={message} key={`card-${i}`} />
      ))}
    </Screen>
  );
}
