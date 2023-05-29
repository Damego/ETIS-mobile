import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import {
  cacheMarksData,
  cacheSignsData,
  composePointsAndMarks,
  getMarksData,
  getPartialSignsData,
} from '../../data/signs';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ISessionSignsData } from '../../models/sessionPoints';
import { signOut } from '../../redux/reducers/authSlice';
import { setFetchedLatestSession, setMarks } from '../../redux/reducers/signsSlice';
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

interface ISubjectListProps {
  data: ISessionSignsData;
}

const SubjectList = ({ data }: ISubjectListProps): JSX.Element[] =>
  data.subjects.map((subject) => <CardSign subject={subject} key={subject.name} />);

const Signs = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { sessionsMarks, fetchedLatestSession } = useAppSelector((state) => state.signs);
  const [data, setData] = useState<ISessionSignsData>(null);
  const [optionData, setOptionData] = useState(null);

  const loadData = async (session?: number) => {
    // We use dropdown to fetch new data, and we need to show loading state while data is fetching
    if (data) setLoading(true);

    const result = await getPartialSignsData({
      useCache: true,
      useCacheFirst:
        data &&
        (session < data.latestSession || (session === data.latestSession && fetchedLatestSession)),
      session: session,
    });

    if (result.isLoginPage) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    // Очевидно, что в самом начале мы получаем текущую, т.е. последнюю сессию
    if (!data) {
      dispatch(setFetchedLatestSession(true));
    }

    let marksResult;
    if (sessionsMarks.length === 0) {
      marksResult = await getMarksData({ useCache: true });
      dispatch(setMarks(marksResult.data));
      cacheMarksData(marksResult.data);
    }

    const fullData = composePointsAndMarks(
      result.data,
      sessionsMarks.length !== 0 ? sessionsMarks : marksResult.data
    );

    setOptionData(
      buildTrimesterOptions(fullData.currentSession, fullData.latestSession, fullData.sessionName)
    );
    setData(fullData);
    if (data) setLoading(false);

    if (result.fetched) {
      cacheSignsData(result.data);
    }
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
