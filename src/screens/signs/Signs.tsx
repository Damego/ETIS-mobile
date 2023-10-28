import React from 'react';
import { View } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import SessionDropdown from '../../components/SessionDropdown';
import useSignsQuery from '../../hooks/useSignsQuery';
import CardSign from './CardSign';

const Signs = () => {
  const { data, isLoading, refresh, loadSession } = useSignsQuery();

  if (isLoading && !data) return <LoadingScreen onRefresh={refresh} />;
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
          onSelect={loadSession}
        />
      </View>

      {data.subjects.map((subject) => (
        <CardSign subject={subject} key={subject.name} />
      ))}
    </Screen>
  );
};

export default Signs;
