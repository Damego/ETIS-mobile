import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/Button';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { skiBaseBellSchedule } from '~/screens/etis/bellSchedule/skiBaseBellSchedule';
import { fontSize } from '~/utils/texts';

import { lyceumBellSchedule } from './lyceumBellSchedule';
import {
  BellScheduleModes,
  BellScheduleTypes,
  IBellScheduleBreak,
  IBellSchedulePair,
} from './types';
import { universityBellSchedule } from './universityBellSchedule';

const modeToSchedule = {
  [BellScheduleModes.UNIVERSITY]: universityBellSchedule,
  [BellScheduleModes.LYCEUM]: lyceumBellSchedule,
  [BellScheduleModes.SKI_BASE]: skiBaseBellSchedule,
};

const Line = () => {
  const globalStyles = useGlobalStyles();
  return <View style={[{ borderBottomColor: globalStyles.border.borderColor }, styles.line]} />;
};

const PairSchedule = ({ schedule, isPair }: { schedule: IBellSchedulePair; isPair: boolean }) => (
  <View style={styles.pairView}>
    <Text style={styles.pairNumber}>
      {schedule.number}
      {isPair ? '-я пара' : '-й урок'}
    </Text>
    <Text style={styles.timeText}>
      {schedule.start} - {schedule.end}
    </Text>
  </View>
);

const BreakSchedule = ({ schedule }: { schedule: IBellScheduleBreak }) => (
  <View style={{ flexDirection: 'row' }}>
    <Line />
    <Text style={fontSize.mini}>Перерыв {schedule.number} минут</Text>
    <Line />
  </View>
);

const BellSchedule = () => {
  const [mode, setMode] = useState<BellScheduleModes>(BellScheduleModes.UNIVERSITY);
  const array = modeToSchedule[mode];

  const handleModeChange = (mode: BellScheduleModes) => () => {
    setMode(mode);
  };

  return (
    <Screen>
      <View style={styles.buttonView}>
        <Button
          text={'Университет'}
          onPress={handleModeChange(BellScheduleModes.UNIVERSITY)}
          variant={mode === BellScheduleModes.UNIVERSITY ? 'primary' : 'card'}
          fontStyle={fontSize.medium}
        />
        <Button
          text={'Лицей'}
          onPress={handleModeChange(BellScheduleModes.LYCEUM)}
          variant={mode === BellScheduleModes.LYCEUM ? 'primary' : 'card'}
          fontStyle={fontSize.medium}
        />
        <Button
          text={'Лыжная база'}
          onPress={handleModeChange(BellScheduleModes.SKI_BASE)}
          variant={mode === BellScheduleModes.SKI_BASE ? 'primary' : 'card'}
          fontStyle={fontSize.medium}
        />
      </View>

      <View style={styles.listView}>
        {array.map((item, index) =>
          item.type === BellScheduleTypes.PAIR ? (
            <PairSchedule
              schedule={item}
              isPair={mode !== BellScheduleModes.LYCEUM}
              key={index}
            />
          ) : (
            <BreakSchedule schedule={item} key={index} />
          )
        )}
      </View>
    </Screen>
  );
};

export default BellSchedule;

const styles = StyleSheet.create({
  listView: {
    gap: 8,
  },
  buttonView: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: '4%',
  },
  pairView: {
    justifyContent: 'center',
  },
  pairNumber: {
    position: 'absolute',
    marginLeft: '2%',
  },
  timeText: {
    fontWeight: '500',
    alignSelf: 'center',
    ...fontSize.large,
  },
  line: {
    borderBottomWidth: 1,
    alignSelf: 'center',
    flex: 1,
    marginHorizontal: '2%',
  },
});
