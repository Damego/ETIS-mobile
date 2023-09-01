import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import SessionDropdown from '../../components/SessionDropdown';
import { useClient } from '../../data/client';
import { composePointsAndMarks } from '../../data/signs';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { GetResultType, IGetResult, RequestType } from '../../models/results';
import { ISessionMarks } from '../../models/sessionMarks';
import { ISessionPoints } from '../../models/sessionPoints';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { setMarks } from '../../redux/reducers/signsSlice';
import { setCurrentSession } from '../../redux/reducers/studentSlice';
import CardSign from './CardSign';

const Signs = () => {
  const [data, setData] = useState<ISessionPoints>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const fetchedSessions = useRef<number[]>([]);
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const { sessionsMarks } = useAppSelector((state) => state.signs);
  const { currentSession } = useAppSelector((state) => state.student);
  const client = useClient();

  const loadData = async ({ session, force }: { session?: number; force?: boolean }) => {
    setLoading(true);

    let newSession: number;
    if (session !== undefined) newSession = session;
    else if (data) newSession = data.currentSession;

    const useCacheFirst =
      !force && data && (newSession < currentSession || fetchedSessions.current.includes(session));

    const result = await client.getSessionSignsData({
      requestType: useCacheFirst ? RequestType.tryCache : RequestType.tryFetch,
      session: newSession,
    });

    if (result.type == GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }
    if (!result.data) {
      if (!data) {
        const cached = await client.getSessionSignsData({
          session: (await cache.getStudent()).currentSession,
          requestType: RequestType.forceCache,
        });
        if (cached.data) {
          setData(cached.data);
        }
      } else ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      setLoading(false);
      return;
    }

    // Очевидно, что в самом начале мы получаем текущую сессию
    if (!data) {
      dispatch(setCurrentSession(result.data.currentSession));
      cache.placePartialStudent({ currentSession: result.data.currentSession });
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

    if (!fetchedSessions.current.includes(result.data.currentSession)) {
      fetchedSessions.current.push(result.data.currentSession);
    }
    setData(fullData);
    setLoading(false);
  };
  const refresh = () => loadData({ force: true });

  useEffect(() => {
    if (!isAuthorizing) loadData({});
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
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
