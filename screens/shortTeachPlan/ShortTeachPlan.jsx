import React, { useContext, useEffect, useState } from 'react';

import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { parseShortTeachPlan } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { httpClient } from '../../utils';
import Trimester from './Trimester';

const ShortTeachPlan = () => {
  const { toggleSignIn } = useContext(AuthContext);
  const [data, setData] = useState(null);

  const loadData = async () => {
    const html = await httpClient.getTeachPlan();
    if (!html) return;

    if (isLoginPage(html)) {
      toggleSignIn(true);
      return;
    }

    const loadedData = parseShortTeachPlan(html);
    setData(loadedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Учебный план" />;

  return (
    <Screen headerText="Учебный план" onUpdate={loadData}>
      {data.map((trimester) => (
        <CardHeaderOut topText={trimester.trimester} key={`card-${trimester.trimester}`}>
          <Trimester data={trimester} key={trimester.trimester} />
        </CardHeaderOut>
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
