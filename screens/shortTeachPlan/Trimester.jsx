import React from 'react';
import { View } from 'react-native';

import Subject from './Subject';
import BorderLine from '../../components/BorderLine';

const Trimester = ({ data }) => (
  <View>
    {data.subjects.map((subject, index) => (
      <View key={subject.subject}>
        <Subject data={subject}/>

        {index !== data.subjects.length - 1 ? <BorderLine /> : ''}
      </View>
    ))}
  </View>
);

export default Trimester;
