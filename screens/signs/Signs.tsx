import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { ISessionMarks } from '../../models/sessionMarks';
import { ISessionPoints } from '../../models/sessionSignsData';
import { parseSessionMarks, parseSessionPoints } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import CardSign from './CardSign';

const buildOption = (session: number, sessionName: string) => ({
  label: `${session} ${sessionName}`,
  value: session,
});

function buildTrimesterOptions(currentSession: number, latestSession: number, sessionName: string) {
  const options = [];
  for (let index = latestSession; index > 0; index -= 1) {
    if (index !== currentSession) options.push(buildOption(index, sessionName));
  }

  return {
    current: buildOption(currentSession, sessionName),
    options,
  };
}

const addSessionMarksToPoints = (
  allSessionMarks: ISessionMarks[],
  sessionSignsData: ISessionPoints
) => {
  const sessionMarks = allSessionMarks.find(
    (sessionData) => sessionData.fullSessionNumber === sessionSignsData.currentSession
  );

  if (sessionMarks) {
    sessionSignsData.subjects.forEach((subject) => {
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

  const loadData = async (session?: number) => {
    // We use dropdown to fetch new data, and we need to show loading state while data is fetching
    if (data) setLoading(true);

    const html = await httpClient.getSigns('current', session);
    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    if (allSessionMarks.current === undefined)
      allSessionMarks.current = parseSessionMarks(await httpClient.getSigns('session'));

    const sessionSignsData = parseSessionPoints(html);
    addSessionMarksToPoints(allSessionMarks.current, sessionSignsData);

    setOptionData(
      buildTrimesterOptions(
        sessionSignsData.currentSession,
        sessionSignsData.latestSession,
        sessionSignsData.sessionName
      )
    );
    setData(sessionSignsData);
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
