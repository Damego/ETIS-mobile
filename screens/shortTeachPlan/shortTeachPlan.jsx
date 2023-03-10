import React, { useState, useEffect } from 'react';
import { v4 as uuid4 } from 'uuid';

import { vars } from '../../utils/vars';
import LoadingPage from '../../components/LoadingPage';
import Trimester from './Trimester';
import Card from '../../components/Card';
import Screen from '../../components/Screen';


const getTeachPlan = async () => {
  const html = await vars.httpClient.getTeachPlan();
  if (html) {
    return vars.parser.parseTeachPlan(html);
  }
};

const ShortTeachPlan = () => {
  const [data, setData] = useState(null);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      const loadedData = await getTeachPlan();
      if (!loadedData) {
        return console.warn('cannot load teach plan');
      }
      setLoaded(true);
      setData(loadedData);
    };
    wrapper();
  });

  if (!isLoaded || !data) return <LoadingPage />;

  return (
    <Screen headerText="Учебный план">
      {data.map((trimester) => (
        <Card
          topText={trimester.trimester}
          component={<Trimester data={trimester} key={uuid4()} />}
          key={uuid4()}
        />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
