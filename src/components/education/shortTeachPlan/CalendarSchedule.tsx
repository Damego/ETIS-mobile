import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { ICalendarSchedule, ISessionSchedule } from '~/models/calendarSchedule';
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
        <Text style={styles.sessionScheduleTitleText}>{session.title}</Text>
        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && <Text style={fontSize.medium}>{session.dates.join('\n')}</Text>}
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
        <ActivityIndicator size="large" color={globalStyles.primaryText.color} />
      )}
    </View>
  );
};

export default function CalendarSchedule() {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);
  const client = useClient();
  const { data, update } = useQuery({
    method: client.getCalendarScheduleData,
    skipInitialGet: true,
  });

  const handlePress = () => {
    if (isOpened) return setOpened(false);

    setOpened(true);
    if (!data) update();
  };

  return (
    <View style={[styles.scheduleContainer, globalStyles.card]}>
      <TouchableOpacity onPress={handlePress} style={styles.scheduleButton} activeOpacity={0.45}>
        <Text style={styles.scheduleButtonText}>Календарный учебный график</Text>
        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && <CalendarScheduleMenu data={data} />}
    </View>
  );
}

const styles = StyleSheet.create({
  scheduleContainer: {
    paddingVertical: '2%',
    paddingHorizontal: '2%',
  },
  scheduleButton: {
    paddingVertical: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontWeight: '600',
    ...fontSize.medium,
  },
  sessionScheduleTitleText: {
    fontWeight: '600',
    paddingVertical: '2%',
    ...fontSize.medium,
  },
});
