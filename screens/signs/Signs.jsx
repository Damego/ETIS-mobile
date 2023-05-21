import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { parseSessionMarks, parseSessionPoints } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/authSlice';
import { httpClient } from '../../utils';
import CardSign from './CardSign';

function buildTrimesterOptions(currentTrimester, latestTrimester) {
  const buildOption = (trimester) => ({ label: `${trimester} Триместр`, value: trimester });

  const options = [];
  for (let index = latestTrimester; index > 0; index -= 1) {
    if (index !== currentTrimester) options.push(buildOption(index));
  }

  return {
    current: buildOption(currentTrimester),
    options,
  };
}

const addSessionMarksToPoints = (allSessionMarks, sessionPoints) => {
  const sessionMarks = allSessionMarks.current
    .filter((sessionData) => sessionData.fullSessionNumber === sessionPoints.currentTrimester)
    .at(0);

  if (sessionMarks) {
    sessionPoints.subjects.forEach((subject) => {
      const [subjectMarkData] = sessionMarks.disciplines.filter(
        (discipline) => discipline.name === subject.subject
      );
      if (subjectMarkData) subject.mark = subjectMarkData.mark;
    });
  }
};

const Signs = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const allSessionMarks = useRef();
  const [optionData, setOptionData] = useState(null);

  const loadData = async (trimester) => {
    // We use dropdown to fetch new data, and we need to show loading state while data is fetching
    if (data) setLoading(true);

    const html = await httpClient.getSigns('current', trimester);
    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    if (allSessionMarks.current === undefined)
      allSessionMarks.current = parseSessionMarks(await httpClient.getSigns('session'));

    const sessionPoints = parseSessionPoints(html);
    addSessionMarksToPoints(allSessionMarks, sessionPoints);

    setOptionData(
      buildTrimesterOptions(sessionPoints.currentTrimester, sessionPoints.latestTrimester)
    );
    setData(sessionPoints);
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
