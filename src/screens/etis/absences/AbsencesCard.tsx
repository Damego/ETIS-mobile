import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import CardHeaderOut from '~/components/CardHeaderOut';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { IAbsenceDate, IDisciplineAbsences } from '~/models/absences';

const AbsencesCard = ({ disciplineAbsences }: { disciplineAbsences: IDisciplineAbsences }) => {
  const theme = useAppTheme();
  const [isOpened, setOpened] = useState(false);
  const covered = disciplineAbsences.dates.filter((date) => date.isCovered).length;

  return (
    <CardHeaderOut topText={disciplineAbsences.subject}>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={[{ flexDirection: 'row' }]}
        activeOpacity={0.45}
      >
        <View style={{ marginRight: '2%' }}>
          {disciplineAbsences.dates.map((date: IAbsenceDate, index: number) => (
            <Text
              key={index}
              style={{ fontWeight: '500' }}
              colorVariant={date.isCovered ? undefined : 'primary'}
            >
              {date.date}
            </Text>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            colorVariant={'block'}
          >{`Пропущенных занятий: ${disciplineAbsences.dates.length}`}</Text>
          {!!covered && <Text>{`По уважительной причине: ${covered}`}</Text>}
          {isOpened && (
            <>
              <Text colorVariant={'block'}>{`Преподаватель: ${disciplineAbsences.teacher}`}</Text>
              <Text colorVariant={'block'}>{`Вид работы: ${disciplineAbsences.type}`}</Text>
            </>
          )}
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
          <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={theme.colors.textForBlock} />
        </View>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default AbsencesCard;
