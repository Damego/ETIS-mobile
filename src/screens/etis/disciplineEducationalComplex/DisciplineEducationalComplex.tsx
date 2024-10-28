import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '~/components/Card';
import DisciplineType from '~/components/DisciplineType';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { EducationStackScreenProps } from '~/navigation/types';
import AdditionalMaterials from '~/screens/etis/disciplineEducationalComplex/components/AdditionalMaterials';
import EvaluationIndicators from '~/screens/etis/disciplineEducationalComplex/components/EvaluationIndicators';
import ExamQuestions from '~/screens/etis/disciplineEducationalComplex/components/ExamQuestions';
import PlannedLearningOutcome from '~/screens/etis/disciplineEducationalComplex/components/PlannedLearningOutcome';
import Themes from '~/screens/etis/disciplineEducationalComplex/components/Themes';
import { fontSize, getDisciplineTypeFromReporting } from '~/utils/texts';

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
      <Text style={[fontSize.big, styles.boldText]}>Трудоёмкость:</Text>

      <Text style={fontSize.medium}>
        Аудиторная работа: {classWorkHours} часов ({classWorkHours / 2} пар)
      </Text>
      <Text style={fontSize.medium}>Самостоятельная работа: {soloWorkHours} часов</Text>
      <Text style={fontSize.medium}>Всего: {totalWorkHours} часов</Text>
    </>
  );
};

const DisciplineEducationalComplex = ({
  route,
}: EducationStackScreenProps<'DisciplineEducationalComplex'>) => {
  const { disciplineTeachPlan, period } = route.params;

  const client = useClient();
  const { data } = useQuery({
    method: client.getDisciplineEducationalComplex,
    payload: {
      data: {
        disciplineId: disciplineTeachPlan.id,
        disciplineTeachPlanId: disciplineTeachPlan.teachPlanId,
      },
      requestType: RequestType.tryFetch,
    },
  });

  return (
    <Screen>
      <Text style={[fontSize.slarge, styles.boldText]}>{disciplineTeachPlan.name}</Text>
      <DisciplineType type={getDisciplineTypeFromReporting(disciplineTeachPlan.reporting)} />

      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <Text style={[fontSize.big, styles.boldText]}>
          Период обучения: <Text style={fontSize.big}>{period}</Text>
        </Text>
      </View>

      <DisciplineWorkHours
        classWorkHours={disciplineTeachPlan.classWorkHours}
        soloWorkHours={disciplineTeachPlan.soloWorkHours}
        totalWorkHours={disciplineTeachPlan.totalWorkHours}
      />

      {data && (
        <Card style={{ marginTop: 'auto', marginBottom: '4%', gap: 8 }}>
          {!!data.themes?.length && (
            <Themes themes={data.themes} disciplineName={data.discipline} />
          )}
          {!!data.examQuestions?.length && <ExamQuestions questions={data.examQuestions} />}
          {data.evaluationIndicators && <EvaluationIndicators data={data.evaluationIndicators} />}
          {data.additionalMaterials && <AdditionalMaterials data={data.additionalMaterials} />}
          {!!data.plannedLearningOutcome?.length && (
            <PlannedLearningOutcome data={data.plannedLearningOutcome} />
          )}
        </Card>
      )}
    </Screen>
  );
};

export default DisciplineEducationalComplex;

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
});
