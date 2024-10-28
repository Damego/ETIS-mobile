import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { EducationStackScreenProps } from '~/navigation/types';
import { ControlBadge } from '~/screens/etis/disciplineEducationalComplex/components/ControlBadge';
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
    <Screen containerStyle={{ gap: 8 }}>
      <Text style={[fontSize.slarge, styles.boldText]}>{disciplineName}</Text>
      <Text style={fontSize.slarge}>{theme.name}</Text>
      {theme.hasCheckPoint && <ControlBadge />}

      {!!data?.annotation && (
        <View>
          <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Аннотация</Text>
          <Text style={fontSize.medium}>{data.annotation}</Text>
        </View>
      )}

      {data && (
        <Card style={{ marginTop: 'auto', marginBottom: '4%', gap: 8 }}>
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
