import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import { useGlobalStyles } from '../../hooks';
import { IAbsenceDate, IDisciplineAbsences } from '../../models/absences';

const AbsencesCard = ({ disciplineAbsences }: { disciplineAbsences: IDisciplineAbsences }) => {
  const globalStyles = useGlobalStyles();
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
              style={[
                { fontWeight: '500' },
                date.isCovered ? globalStyles.textColor : globalStyles.primaryFontColor,
              ]}
            >
              {date.date}
            </Text>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.textColor}>
            {`Пропущенных занятий: ${disciplineAbsences.dates.length}`}
          </Text>
          {!!covered && (
            <Text style={globalStyles.textColor}>{`По уважительной причине: ${covered}`}</Text>
          )}
          {isOpened && (
            <>
              <Text style={globalStyles.textColor}>
                {`Преподаватель: ${disciplineAbsences.teacher}`}
              </Text>
              <Text style={globalStyles.textColor}>{`Вид работы: ${disciplineAbsences.type}`}</Text>
            </>
          )}
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
          <AntDesign
            name={isOpened ? 'up' : 'down'}
            size={18}
            color={globalStyles.textColor.color}
          />
        </View>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default AbsencesCard;
