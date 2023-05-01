import React, { useEffect, useState } from 'react';

import Card from '../../components/Card';
import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { vars } from '../../utils/vars';
import Trimester from './Trimester';

const ShortTeachPlan = () => {
  const [data, setData] = useState(null);

  const loadData = async () => {
    const html = await vars.httpClient.getTeachPlan();
    if (html) {
      const loadedData = vars.parser.parseTeachPlan(html);
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
        <Card
          topText={trimester.trimester}
          key={`card-${trimester.trimester}`}
        >
          <Trimester data={trimester} key={trimester.trimester} />
        </Card>
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
