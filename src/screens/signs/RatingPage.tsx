import React, { useEffect, useRef, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import SessionDropdown from '../../components/SessionDropdown';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { IGroup, ISessionRating } from '../../models/rating';
import { GetResultType, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
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
  const [data, setData] = useState<ISessionRating>();
  const [isLoading, setLoading] = useState(false);
  const fetchedFirstTime = useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const client = getWrappedClient();

  const loadData = async ({ session, force }: { session?: number; force: boolean }) => {
    setLoading(true);
    const result = await client.getRatingData({
      requestType: !force && fetchedFirstTime.current ? RequestType.tryCache : RequestType.tryFetch,
      session,
    });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }
    if (!result.data) {
      if (!data) {
        const cached = await client.getRatingData({
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

    setData(result.data);
    if (!fetchedFirstTime.current) {
      fetchedFirstTime.current = true;
    }
    setLoading(false);
  };
  const refresh = () => loadData({ session: data?.session?.current, force: true });

  useEffect(() => {
    loadData({ force: false });
  }, []);

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
          onSelect={(session) => {
            loadData({ session, force: false });
          }}
        />
      </View>

      {data.groups.map((group) => (
        <Group group={group} key={group.name} />
      ))}
    </Screen>
  );
}
