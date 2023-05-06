import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Dropdown from '../../components/Dropdown';
import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { vars } from '../../utils/vars';
import CardSign from './CardSign';

function buildTrimesterOptions(currentTrimester, latestTrimester) {
  const options = [];
  let index = 0;

  while (index <= latestTrimester) {
    index += 1
    if (index === currentTrimester) continue;

    options.push({
      label: `${index} Триместр`,
      value: index,
    });
  }

  return {
    current: {
      label: `${currentTrimester} Триместр`,
      value: currentTrimester,
    },
    options,
  };
}

const Signs = () => {
  const [data, setData] = useState(null);
  const [optionData, setOptionData] = useState(null);

  const loadData = async (trimester) => {
    const html = await vars.httpClient.getSigns('current', { trimester });
    if (vars.parser.isLoginPage(html)) return; // TODO: move to auth page

    const parsedData = vars.parser.parseSigns(html);
    setOptionData(buildTrimesterOptions(parsedData.currentTrimester, parsedData.latestTrimester));
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data || !optionData) return <LoadingPage />;
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
