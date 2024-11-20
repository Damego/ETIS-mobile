import React from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import CardHeaderOut from '~/components/CardHeaderOut';
import { ISessionTeachPlan } from '~/models/teachPlan';
import { fontSize } from '~/utils/texts';

import Subject from './Discipline';

const SessionCard = ({ data }: { data: ISessionTeachPlan }) => (
  <CardHeaderOut topText={data.period.string} topTextStyle={fontSize.large}>
    {data.disciplines.map((discipline, index) => (
      <View key={discipline.name}>
        <Subject data={discipline} period={data.period.string} />
        {index !== data.disciplines.length - 1 && <BorderLine />}
      </View>
    ))}
  </CardHeaderOut>
);

export default SessionCard;
