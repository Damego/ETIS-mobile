import React from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import { ISessionPoints } from '~/models/sessionPoints';

import CardSign from './CardSign';

const GradesContainer = ({ data }: { data: ISessionPoints }) => {
  return data.subjects.map((subject, index) => (
    <View key={subject.name}>
      <CardSign subject={subject} />
      {index !== data.subjects.length - 1 && <BorderLine />}
    </View>
  ));
};

export default GradesContainer;
