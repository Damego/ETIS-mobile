import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { DisciplineTypes } from '~/models/other';
import { ITeachPlanDiscipline } from '~/models/teachPlan';
import { fontSize } from '~/utils/texts';

const styles = StyleSheet.create({
  subjectDropdownView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitleView: {
    flex: 1,
    gap: 4,
  },
  subjectNameText: {
    fontWeight: '500',
    ...fontSize.medium,
  },
  boldText: {
    fontWeight: '500',
  },
});

const DisciplineWorkHours = ({
  classWorkHours,
  soloWorkHours,
  totalWorkHours,
}: {
  classWorkHours: number;
  soloWorkHours: number;
  totalWorkHours: number;
}) => {
  return (
    <>
      <Text style={[fontSize.medium, styles.boldText]}>Трудоёмкость:</Text>

      <Text style={fontSize.medium}>
        Аудиторная работа: {classWorkHours} часов ({classWorkHours / 2} пар)
      </Text>
      <Text style={fontSize.medium}>
        Самостоятельная работа: {soloWorkHours} часов ({soloWorkHours / 2} пар)
      </Text>
      <Text style={fontSize.medium}>
        Всего: {totalWorkHours} часов ({totalWorkHours / 2} пар)
      </Text>
    </>
  );
};

const getDisciplineType = (reporting: string) =>
  ({
    Экзамен: DisciplineTypes.EXAM,
    Зачет: DisciplineTypes.TEST,
  })[reporting];

const Subject = ({ data }: { data: ITeachPlanDiscipline }) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={styles.subjectDropdownView}
        activeOpacity={0.45}
      >
        <View style={styles.subjectTitleView}>
          <Text style={styles.subjectNameText}>{data.name}</Text>
          <DisciplineType type={getDisciplineType(data.reporting)} />
        </View>

        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && (
        <DisciplineWorkHours
          classWorkHours={data.classWorkHours}
          soloWorkHours={data.soloWorkHours}
          totalWorkHours={data.totalWorkHours}
        />
      )}
    </>
  );
};

export default Subject;
