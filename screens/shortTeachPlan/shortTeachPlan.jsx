import React, { useEffect, useState } from 'react';

import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { httpClient, parser } from '../../utils';
import Trimester from './Trimester';

const ShortTeachPlan = () => {
  const [data, setData] = useState(null);

  const loadData = async () => {
    const html = await httpClient.getTeachPlan();
    if (html) {
      const loadedData = parser.parseTeachPlan(html);
      setData(loadedData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingPage />;

  return (
    <Screen headerText="Учебный план" onUpdate={loadData}>
      {data.map((trimester) => (
        <CardHeaderOut
          topText={trimester.trimester}
          key={`card-${trimester.trimester}`}
        >
          <Trimester data={trimester} key={trimester.trimester} />
        </CardHeaderOut>
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
