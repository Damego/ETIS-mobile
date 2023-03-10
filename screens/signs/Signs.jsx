import React, { useState, useEffect } from 'react';
import { v4 as uuid4 } from 'uuid';

import { vars } from '../../utils/vars';
import LoadingPage from '../../components/LoadingPage';
import Subject from './Subject';
import Card from '../../components/Card';
import Screen from '../../components/Screen';

const Signs = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      const html = await vars.httpClient.getSigns('current');
      if (vars.parser.isLoginPage(html)) return;

      const parsedData = vars.parser.parseSigns(html);
      setLoaded(true);
      setData(parsedData);
    };
    wrapper();
  });

  if (!isLoaded || !data) return <LoadingPage />;

  return (
    <Screen headerText="Оценки">
      {data.map((subject) => (
        <Card topText={subject.subject} component={<Subject data={subject} />} key={uuid4()} />
      ))}
    </Screen>
  );
};

export default Signs;
