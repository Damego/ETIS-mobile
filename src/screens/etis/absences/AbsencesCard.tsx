import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import CardHeaderOut from '~/components/CardHeaderOut';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { IAbsenceDate, IDisciplineAbsences } from '~/models/absences';

const AbsencesCard = ({ disciplineAbsences }: { readonly disciplineAbsences: IDisciplineAbsences }) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const [isOpened, setOpened] = useState(false);
  const covered = disciplineAbsences.dates.filter((date) => date.isCovered).length;

  return (
    <CardHeaderOut topText={disciplineAbsences.subject}>
      <TouchableOpacity
        style={[{ flexDirection: 'row' }]}
        activeOpacity={0.45}
        onPress={() => setOpened(!isOpened)}
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
          <Text>{t('absences.missed', { count: disciplineAbsences.dates.length })}</Text>
          {Boolean(covered) && <Text>{t('absences.covered', { count: covered })}</Text>}
          {isOpened ? <>
            <Text>{t('checkPoint.teacher')} {disciplineAbsences.teacher}</Text>
            <Text>{t('checkPoint.workType')} {disciplineAbsences.type}</Text>
          </> : null}
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
          <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={theme.colors.text} />
        </View>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default AbsencesCard;
