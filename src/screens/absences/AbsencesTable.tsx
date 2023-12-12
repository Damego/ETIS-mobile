import React from 'react';
import { View } from 'react-native';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useClient } from '../../data/client';
import useQuery from '../../hooks/useQuery';
import { RequestType } from '../../models/results';
import AbsencesCard from './AbsencesCard';

const AbsencesTable = () => {
  const client = useClient();
  const { data, isLoading, refresh, update } = useQuery({
    method: client.getAbsencesData,
  });
  const loadSession = (session: number) => {
    update({ data: session, requestType: RequestType.tryFetch });
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
        <Dropdown
          selectedOption={{
            label: data.currentSession.name,
            value: data.currentSession.number,
            current: false,
          }}
          options={data.sessions.map((session) => ({
            label: session.name,
            value: session.number,
            current: session.number === data.currentSession.number,
          }))}
          onSelect={loadSession}
        />
      </View>

      {data.absences.length ? (
        <>
          {data.absences.map((absences, index) => (
            <AbsencesCard key={index} disciplineAbsences={absences} />
          ))}
          <Text>{`Всего пропущено занятий: ${data.overallMissed}`}</Text>
        </>
      ) : (
        <NoData text="Нет пропущенных занятий!" />
      )}
    </Screen>
  );
};

export default AbsencesTable;
