import React, { useRef } from 'react';
import { View } from 'react-native';

import { cache } from '../../cache/smartCache';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import SessionDropdown from '../../components/SessionDropdown';
import { useClient } from '../../data/client';
import { composePointsAndMarks } from '../../data/signs';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { IGetResult, RequestType } from '../../models/results';
import { ISessionMarks } from '../../models/sessionMarks';
import { setCurrentSession } from '../../redux/reducers/studentSlice';
import CardSign from './CardSign';

const Signs = () => {
  const fetchedSessions = useRef<number[]>([]);
  const dispatch = useAppDispatch();
  const sessionsMarks = useRef<ISessionMarks[]>([]);
  const { currentSession } = useAppSelector((state) => state.student);
  const client = useClient();
  const { data, isLoading, update, refresh } = useQuery({
    method: client.getSessionSignsData,
    payload: {
      requestType: RequestType.tryFetch,
    },
    after: async (result) => {
      // oh dear...
      let marksResult: IGetResult<ISessionMarks[]>;
      if (sessionsMarks.current.length === 0) {
        marksResult = await client.getSessionMarksData({ requestType: RequestType.tryFetch });

        if (marksResult.data) {
          sessionsMarks.current = marksResult.data;
        }
      }

      result.data = composePointsAndMarks(
        result.data,
        sessionsMarks.current.length !== 0 ? sessionsMarks.current : marksResult.data
      );
      // Очевидно, что в самом начале мы получаем текущую сессию
      const currentSession = result.data.currentSession;
      if (!data) {
        dispatch(setCurrentSession(currentSession));
        cache.placePartialStudent({ currentSession: currentSession });
      }

      if (!fetchedSessions.current.includes(currentSession)) {
        fetchedSessions.current.push(currentSession);
      }
    },
    onFail: async () => {
      update({
        requestType: RequestType.forceCache,
        data: (await cache.getStudent()).currentSession,
      });
    },
  });
  const innerUpdate = (session: number) => {
    update({
      data: session,
      requestType:
        session < currentSession || fetchedSessions.current.includes(session)
          ? RequestType.tryCache
          : RequestType.tryFetch,
    });
  };

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
          onSelect={innerUpdate}
        />
      </View>

      {data.subjects.map((subject) => (
        <CardSign subject={subject} key={subject.name} />
      ))}
    </Screen>
  );
};

export default Signs;
