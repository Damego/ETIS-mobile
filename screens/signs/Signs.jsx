import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { httpClient, parser } from '../../utils';
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
  const [data, setData] = useState(null);
  const [optionData, setOptionData] = useState(null);

  const loadData = async (trimester) => {
    const html = await httpClient.getSigns('current', { trimester });
    if (!html) return;

    if (parser.isLoginPage(html)) return; // TODO: move to auth page

    const parsedData = parser.parseSigns(html);
    setOptionData(buildTrimesterOptions(parsedData.currentTrimester, parsedData.latestTrimester));
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data || !optionData) return <LoadingScreen headerText="Оценки" />;
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
