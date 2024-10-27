import React from 'react';
import { StyleSheet } from 'react-native';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { EducationStackScreenProps } from '~/navigation/types';
import Annotation from '~/screens/etis/disciplineEducationalComplexTheme/components/Annotation';
import ControlRequirements from '~/screens/etis/disciplineEducationalComplexTheme/components/ControlRequirements';
import ListData from '~/screens/etis/disciplineEducationalComplexTheme/components/ListData';
import { fontSize } from '~/utils/texts';

const DisciplineEducationalComplexTheme = ({
  route,
}: EducationStackScreenProps<'DisciplineEducationalComplexTheme'>) => {
  const { disciplineName, theme } = route.params;

  const client = useClient();
  const { data } = useQuery({
    method: client.getDisciplineEducationalComplexTheme,
    payload: {
      data: {
        themeId: theme.id,
        disciplineTeachPlanId: theme.disciplineTeachPlanId,
      },
      requestType: RequestType.tryFetch,
    },
  });

  return (
    <Screen>
      <Text style={[fontSize.slarge, styles.boldText]}>{disciplineName}</Text>
      <Text style={[fontSize.slarge, styles.boldText]}>{theme.name}</Text>

      {data && (
        <Card style={{ marginTop: 'auto', marginBottom: '4%', gap: 8 }}>
          {!!data.annotation && <Annotation data={data.annotation} />}
          {!!data.controlRequirements && <ControlRequirements data={data.controlRequirements} />}
          {!!data.links?.length && (
            <ListData label={'Другое обеспечение курса'} data={data.links} />
          )}
          {!!data.requiredLiterature?.length && (
            <ListData label={'Обязательная литература'} data={data.requiredLiterature} />
          )}
          {!!data.additionalLiterature?.length && (
            <ListData label={'Дополнительная литература'} data={data.additionalLiterature} />
          )}
        </Card>
      )}
    </Screen>
  );
};

export default DisciplineEducationalComplexTheme;

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
});
