import React, { useRef } from 'react';
import { Text, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import SessionDropdown from '../../components/SessionDropdown';
import { useClient } from '../../data/client';
import { useGlobalStyles } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { IGroup } from '../../models/rating';
import { RequestType } from '../../models/results';
import { fontSize } from '../../utils/texts';
import RightText from './RightText';

const Group = ({ group }: { group: IGroup }) => {
  const globalStyles = useGlobalStyles();

  if (!group.overall) {
    return (
      <CardHeaderOut topText={group.name}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[{ fontWeight: 'bold' }, fontSize.medium, globalStyles.textColor]}>
            Нет рейтинга для отображения
          </Text>
        </View>
      </CardHeaderOut>
    );
  }
  return (
    <CardHeaderOut topText={group.name}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: '70%' }}>
          {group.disciplines.map((discipline, index) => (
            <View key={discipline.discipline}>
              <Text style={[fontSize.medium, globalStyles.textColor]}>{discipline.discipline}</Text>
              <Text style={[fontSize.medium, globalStyles.textColor]}>
                {discipline.top} из {discipline.total}
              </Text>
              {index !== group.disciplines.length - 1 && <BorderLine />}
            </View>
          ))}
        </View>

        <RightText topText={group.overall.top} bottomText={`из ${group.overall.total}`} />
      </View>
    </CardHeaderOut>
  );
};

export default function RatingPage() {
  const fetchedFirstTime = useRef<boolean>(false);
  const client = useClient();
  const { data, isLoading, refresh, update } = useQuery({
    method: client.getRatingData,
    payload: {
      requestType: RequestType.tryFetch,
    },
    onFail: async () => {
      const student = await cache.getStudent();
      if (!student || !student.currentSession) return;

      update({
        requestType: RequestType.forceCache,
        data: student.currentSession,
      });
    },
    after: () => {
      if (!fetchedFirstTime.current) {
        fetchedFirstTime.current = true;
      }
    },
  });

  const innerUpdate = (session: number) => {
    update({
      requestType: fetchedFirstTime.current ? RequestType.tryCache : RequestType.tryFetch,
      data: session,
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

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
          currentSession={data.session.current}
          latestSession={data.session.latest}
          sessionName={data.session.name}
          onSelect={innerUpdate}
        />
      </View>

      {data.groups.map((group) => (
        <Group group={group} key={group.name} />
      ))}
    </Screen>
  );
}
