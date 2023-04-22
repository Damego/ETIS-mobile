import React, { useEffect, useState } from 'react';

import CardSign from '../../components/CardSign';
import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { vars } from '../../utils/vars';

const Signs = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      const html = await vars.httpClient.getSigns('current');
      if (vars.parser.isLoginPage(html)) return; // TODO: move to auth page

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
        <CardSign subject={subject} key={subject.subject} />
      ))}
    </Screen>
  );
};

export default Signs;
