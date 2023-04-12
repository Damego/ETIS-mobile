import React, { useState, useEffect } from 'react';
import { v4 as uuid4 } from 'uuid';

import { vars } from '../../utils/vars';
import LoadingPage from '../../components/LoadingPage';
import Subject from './Subject';
import CardSign from '../../components/CardSign';
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

  //getting totalMark for every subject
  data.forEach(element => {
    let totalMark = 0;
    let subject = element.info;
    subject.forEach(el => {
      let mark = el.maxScore == 0 ? 0 : (isNaN(el.mark) ? 0 : el.mark);
      totalMark += mark;
    })
    element.totalMark = totalMark;
  });

  return (
    <Screen headerText="Оценки">
      {data.map((subject) => (
        <CardSign topText={subject.subject} component={<Subject data={subject} />} mark={subject.totalMark} key={uuid4()} />
      ))}
    </Screen>
  );
};

export default Signs;
