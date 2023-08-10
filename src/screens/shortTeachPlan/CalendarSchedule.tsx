import React, { useState } from 'react';

import { ActivityIndicator, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { ICalendarSchedule, ISessionSchedule } from '../../models/calendarSchedule';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import BorderLine from '../../components/BorderLine';
import { AntDesign } from '@expo/vector-icons';
import { getWrappedClient } from '../../data/client';
import { GetResultType, RequestType } from '../../models/results';

const SessionSchedule = ({ session }: { session: ISessionSchedule }) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
        }}
        onPress={() => setOpened(!isOpened)}
        activeOpacity={0.45}
      >
        <Text
          style={[
            { fontWeight: '600', paddingVertical: '2%' },
            globalStyles.textColor,
            fontSize.medium,
          ]}
        >
          {session.title}
        </Text>
        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && (
        <View>
          <Text style={[globalStyles.textColor, fontSize.medium]}>{session.dates.join('\n')}</Text>
        </View>
      )}
    </>
  );
};

const CalendarScheduleMenu = ({ data }: { data?: ICalendarSchedule }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View>
      <BorderLine />
      {data ? (
        data.sessions.map((session, index) => (
          <View key={session.title}>
            <SessionSchedule session={session} />
            {index !== data.sessions.length - 1 && <BorderLine />}
          </View>
        ))
      ) : (
        <ActivityIndicator size="large" color={globalStyles.primaryFontColor.color} />
      )}
    </View>
  );
};

export default function CalendarSchedule() {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);
  const [data, setData] = useState<ICalendarSchedule>();
  const dispatch = useAppDispatch();
  const client = getWrappedClient();

  const loadData = async () => {
    setOpened(true);

    const result = await client.getCalendarScheduleData({
      requestType: RequestType.tryFetch // TODO: Определить, когда использовать кэш
    });

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    setData(result.data);
  };

  const handlePress = () => {
    if (isOpened) return setOpened(false);

    setOpened(true);
    if (!data) loadData();
  };

  return (
    <View
      style={[
        {
          paddingVertical: '2%',
          paddingHorizontal: '2%',
          marginBottom: '2%',
        },
        globalStyles.block,
        globalStyles.border,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          paddingVertical: '2%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        activeOpacity={0.45}
      >
        <Text style={[{ fontWeight: '600' }, fontSize.medium, globalStyles.textColor]}>
          Календарный учебный график
        </Text>
        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && <CalendarScheduleMenu data={data} />}
    </View>
  );
}
