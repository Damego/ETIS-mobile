import React from 'react';
import { View } from 'react-native';

import Subject from './Subject';

const BorderLine = () => (
  <View
    style={{
      borderBottomColor: '#d3d3d3',
      borderBottomWidth: 1,
      alignSelf: "center",
      width: "95%",
    }}
  />
);

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
