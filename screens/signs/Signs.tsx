import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { ISessionMarks } from '../../models/sessionMarks';
import { ISessionPoints } from '../../models/sessionPoints';
import { parseSessionMarks, parseSessionPoints } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import CardSign from './CardSign';

const buildOption = (trimester: number) => ({ label: `${trimester} Триместр`, value: trimester });

function buildTrimesterOptions(currentTrimester: number, latestTrimester: number) {
  const options = [];
  for (let index = latestTrimester; index > 0; index -= 1) {
    if (index !== currentTrimester) options.push(buildOption(index));
  }

  return {
    current: buildOption(currentTrimester),
    options,
  };
}

const addSessionMarksToPoints = (
  allSessionMarks: ISessionMarks[],
  sessionPoints: ISessionPoints
) => {
  const sessionMarks = allSessionMarks.find(
    (sessionData) => sessionData.fullSessionNumber === sessionPoints.currentTrimester
  );

  if (sessionMarks) {
    sessionPoints.subjects.forEach((subject) => {
      const discipline = sessionMarks.disciplines.find(
        (discipline) => discipline.name === subject.name
      );
      if (discipline) subject.mark = discipline.mark;
    });
  }
};

interface ISubjectList {
  data: ISessionPoints;
}

const SubjectList = ({ data }: ISubjectList): JSX.Element[] =>
  data.subjects.map((subject) => <CardSign subject={subject} key={subject.name} />);

const Signs = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ISessionPoints>(null);
  const allSessionMarks = useRef<ISessionMarks[]>();
  const [optionData, setOptionData] = useState(null);

  const loadData = async (trimester?: number) => {
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
    addSessionMarksToPoints(allSessionMarks.current, sessionPoints);

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

      <SubjectList data={data} />
    </Screen>
  );
};

export default Signs;
