import React from 'react';
import { View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import Subject from './Subject';

const Trimester = ({ data }) =>
  data.subjects.map((subject, index) => (
    <View key={subject.subject}>
      <Subject data={subject} />

      {index !== data.subjects.length - 1 ? <BorderLine /> : ''}
    </View>
  ));

export default Trimester;
