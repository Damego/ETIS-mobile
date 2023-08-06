import React, { useState } from 'react';

import { ToastAndroid, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { getCalendarSchedule } from '../../data/calendarSchedule';
import { ICalendarSchedule, ISessionSchedule } from '../../models/calendarSchedule';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import BorderLine from '../../components/BorderLine';
import { AntDesign } from '@expo/vector-icons';

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

export default function CalendarSchedule() {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);
  const [data, setData] = useState<ICalendarSchedule>();
  const dispatch = useAppDispatch();

  const loadData = async () => {
    setOpened(true);

    const result = await getCalendarSchedule({
      useCache: true,
      useCacheFirst: false, // TODO: ...
    });

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    setData(result.data);
  };

  const handlePress = () => {
    if (!isOpened) {
      setOpened(true);
      if (!data) loadData();
    } else {
      setOpened(false);
    }
  };

  return (
    <View
      style={[
        {
          paddingVertical: '2%',
          paddingHorizontal: '2%',
        },
        globalStyles.block,
        globalStyles.border,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={[{ fontWeight: '600' }, fontSize.medium]}>Календарный учебный график</Text>
        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && !data && (
        <ActivityIndicator size="large" color={globalStyles.primaryFontColor.color} />
      )}
      {isOpened &&
        data &&
        data.sessions.map((session, index) => (
          <View key={session.title}>
            <SessionSchedule session={session} />
            {index !== data.sessions.length - 1 && <BorderLine />}
          </View>
        ))}
    </View>
  );
}
