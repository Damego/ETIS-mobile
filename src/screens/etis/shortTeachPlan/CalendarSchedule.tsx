import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ToastAndroid, TouchableOpacity, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { ICalendarSchedule, ISessionSchedule } from '~/models/calendarSchedule';
import { GetResultType, RequestType } from '~/models/results';
import { setAuthorizing } from '~/redux/reducers/authSlice';
import { fontSize } from '~/utils/texts';

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
          style={[{ fontWeight: '600', paddingVertical: '2%' }, fontSize.medium]}
          colorVariant={'block'}
        >
          {session.title}
        </Text>
        <AntDesign
          name={isOpened ? 'up' : 'down'}
          size={18}
          color={globalStyles.fontColorForBlock.color}
        />
      </TouchableOpacity>

      {isOpened && (
        <Text style={fontSize.medium} colorVariant={'block'}>
          {session.dates.join('\n')}
        </Text>
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
  const client = useClient();

  const loadData = async () => {
    setOpened(true);

    const result = await client.getCalendarScheduleData({
      requestType: RequestType.tryFetch, // TODO: Определить, когда использовать кэш
    });

    if (!result.data) {
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
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
        <Text style={[{ fontWeight: '600' }, fontSize.medium]} colorVariant={'block'}>
          Календарный учебный график
        </Text>
        <AntDesign
          name={isOpened ? 'up' : 'down'}
          size={18}
          color={globalStyles.fontColorForBlock.color}
        />
      </TouchableOpacity>

      {isOpened && <CalendarScheduleMenu data={data} />}
    </View>
  );
}
