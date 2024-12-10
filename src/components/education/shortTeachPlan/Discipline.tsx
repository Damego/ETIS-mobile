import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import useAppRouter from '~/hooks/useAppRouter';
import { ITeachPlanDiscipline } from '~/models/teachPlan';
import { fontSize, getDisciplineTypeFromReporting } from '~/utils/texts';

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

const Subject = ({ data, period }: { data: ITeachPlanDiscipline; period: string }) => {
  const router = useAppRouter();
  const globalStyles = useGlobalStyles();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push('disciplineEducationalComplex', {
            payload: { disciplineTeachPlan: data, period },
          });
        }}
        style={styles.subjectDropdownView}
        activeOpacity={0.45}
      >
        <View style={styles.subjectTitleView}>
          <Text style={styles.subjectNameText}>{data.name}</Text>
          <DisciplineType type={getDisciplineTypeFromReporting(data.reporting)} />
        </View>

        <AntDesign name={'right'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>
    </>
  );
};

export default Subject;
