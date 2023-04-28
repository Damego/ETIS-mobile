import React from 'react';
import { StyleSheet, View } from 'react-native';

import Subject from './Subject';

const BorderLine = () => (
  <View
    style={{
      borderBottomColor: '#1c1c1c',
      borderBottomWidth: StyleSheet.hairlineWidth,
    }}
  />
);

const Trimester = ({ data }) => (
  <View>
    {data.subjects.map((subject, index) => (
      <View key={subject.subject}>
        <Subject data={subject} />

        {index !== data.subjects.length - 1 ? <BorderLine /> : ''}
      </View>
    ))}
  </View>
);

export default Trimester;
