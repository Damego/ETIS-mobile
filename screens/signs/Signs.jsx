import React, { useEffect, useState } from 'react';

import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { vars } from '../../utils/vars';
import CardSign from './CardSign';

const Signs = () => {
  const [data, setData] = useState(null);

  const loadData = async () => {
    const html = await vars.httpClient.getSigns('current');
    if (vars.parser.isLoginPage(html)) return; // TODO: move to auth page

    const parsedData = vars.parser.parseSigns(html);
    setData(parsedData);
  };

  useEffect(() => {
    if (data) return;
    loadData();
  }, [data]);

  if (!data) return <LoadingPage />;

  return (
    <Screen headerText="Оценки" onUpdate={loadData}>
      {data.map((subject) => (
        <CardSign subject={subject} key={subject.subject} />
      ))}
    </Screen>
  );
};

export default Signs;
