import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { parseCurrentPoints } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { httpClient } from '../../utils';
import CardSign from './CardSign';

function buildTrimesterOptions(currentTrimester, latestTrimester) {
  const buildOption = (trimester) => ({ label: `${trimester} Триместр`, value: trimester });

  const options = [];
  // TODO: Do we need to specify first trimester which shows on site?
  let index = 0;
  while (index <= latestTrimester) {
    index += 1;
    if (index !== currentTrimester) options.push(buildOption(index));
  }

  return {
    current: buildOption(currentTrimester),
    options,
  };
}

const Signs = () => {
  const { toggleSignIn } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [optionData, setOptionData] = useState(null);

  const loadData = async (trimester) => {
    if (data) setLoading(true);

    const html = await httpClient.getSigns('current', { trimester });
    if (!html) return;

    if (isLoginPage(html)) {
      toggleSignIn(true);
      return;
    }

    const parsedData = parseCurrentPoints(html);
    setOptionData(buildTrimesterOptions(parsedData.currentTrimester, parsedData.latestTrimester));
    setData(parsedData);
    if (data) setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data || !optionData || isLoading) return <LoadingScreen headerText="Оценки" />;

  return (
    <Screen headerText="Оценки" onUpdate={loadData}>
      <View style={{ marginLeft: 'auto', marginRight: 0, paddingBottom: '2%', zIndex: 1 }}>
        <Dropdown
          onSelect={loadData}
          selectedOption={optionData.current}
          options={optionData.options}
        />
      </View>
      {data.subjects.map((subject) => (
        <CardSign subject={subject} key={subject.subject} />
      ))}
    </Screen>
  );
};

export default Signs;
