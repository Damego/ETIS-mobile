import React, { useEffect, useState } from 'react';
import { ToastAndroid, View } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import SessionDropdown from '../../components/SessionDropdown';
import { getWrappedClient } from '../../data/client';
import { composePointsAndMarks } from '../../data/signs';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { GetResultType, IGetResult, RequestType } from '../../models/results';
import { ISessionMarks } from '../../models/sessionMarks';
import { ISessionPoints } from '../../models/sessionPoints';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { setFetchedLatestSession, setMarks } from '../../redux/reducers/signsSlice';
import CardSign from './CardSign';

const Signs = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { sessionsMarks, fetchedLatestSession } = useAppSelector((state) => state.signs);
  const [data, setData] = useState<ISessionPoints>(null);
  const client = getWrappedClient();

  const loadData = async ({ session, force }: { session?: number; force?: boolean }) => {
    // We use dropdown to fetch new data, and we need to show loading state while data is fetching
    if (data) setLoading(true);

    let newSession;
    if (session !== undefined) newSession = session;
    else if (data) newSession = data.currentSession;

    const useCacheFirst =
      !force &&
      data &&
      (newSession < data.latestSession ||
        (newSession === data.latestSession && fetchedLatestSession));

    const result = await client.getSessionSignsData({
      requestType: useCacheFirst ? RequestType.tryCache : RequestType.tryFetch,
      session: newSession,
    });

    if (result.type == GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }
    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      setLoading(false);
      return;
    }

    // Очевидно, что в самом начале мы получаем текущую, т.е. последнюю сессию
    if (!data) {
      dispatch(setFetchedLatestSession(true));
    }

    let marksResult: IGetResult<ISessionMarks[]>;
    if (sessionsMarks.length === 0) {
      marksResult = await client.getSessionMarksData({ requestType: RequestType.tryFetch });

      if (marksResult.type === GetResultType.loginPage) {
        dispatch(setAuthorizing(true));
        return;
      }

      if (marksResult.data) {
        dispatch(setMarks(marksResult.data));
      }
    }

    const fullData = composePointsAndMarks(
      result.data,
      sessionsMarks.length !== 0 ? sessionsMarks : marksResult.data
    );

    setData(fullData);
    if (data) setLoading(false);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData({});
  }, [isAuthorizing]);

  if (!data || isLoading) return <LoadingScreen onRefresh={() => loadData({})} />;

  return (
    <Screen onUpdate={() => loadData({ force: true })}>
      <View
        style={{
          marginTop: '2%',
          marginLeft: 'auto',
          marginRight: 0,
          paddingBottom: '2%',
          zIndex: 1,
        }}
      >
        <SessionDropdown
          currentSession={data.currentSession}
          latestSession={data.latestSession}
          sessionName={data.sessionName}
          onSelect={(session) => loadData({ session })}
        />
      </View>

      {data.subjects.map((subject) => (
        <CardSign subject={subject} key={subject.name} />
      ))}
    </Screen>
  );
};

export default Signs;
