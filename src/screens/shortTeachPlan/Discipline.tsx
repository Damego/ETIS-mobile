import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import { useGlobalStyles } from '../../hooks';
import { ITeachPlanDiscipline } from '../../models/teachPlan';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  subjectDropdownView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitleView: {
    flex: 1,
  },
  subjectNameText: {
    fontWeight: '500',
  },
  boldText: {
    fontWeight: 'bold',
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
  const globalStyles = useGlobalStyles();
  const textStyles = [fontSize.medium, globalStyles.textColor];

  return (
    <>
      <Text style={[...textStyles, styles.boldText]}>Трудоёмкость:</Text>

      <Text style={textStyles}>
        Аудиторная работа: {classWorkHours} часов ({classWorkHours / 2} пар)
      </Text>
      <Text style={textStyles}>
        Самостоятельная работа: {soloWorkHours} часов ({soloWorkHours / 2} пар)
      </Text>
      <Text style={textStyles}>
        Всего: {totalWorkHours} часов ({totalWorkHours / 2} пар)
      </Text>
    </>
  );
};

const Subject = ({
  data,
  showBorderLine,
}: {
  data: ITeachPlanDiscipline;
  showBorderLine: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={styles.subjectDropdownView}
        activeOpacity={0.45}
      >
        <View style={[styles.subjectTitleView]}>
          <Text style={[fontSize.medium, styles.subjectNameText, globalStyles.textColor]}>
            {data.name}
          </Text>
          <Text style={[fontSize.medium, globalStyles.textColor]}>
            Отчётность: {data.reporting}
          </Text>
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
      {showBorderLine && <BorderLine />}
    </>
  );
};

export default Subject;
