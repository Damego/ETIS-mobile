import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { ITeachPlanDiscipline } from '~/models/teachPlan';
import { EducationNavigationProp } from '~/navigation/types';
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
  const navigation = useNavigation<EducationNavigationProp>();
  const globalStyles = useGlobalStyles();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DisciplineEducationalComplex', {
            disciplineTeachPlan: data,
            period,
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
