import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {v4 as uuid4} from 'uuid';

import Subject from './Subject';

const Trimester = ({ data }) => {

  return (
    <View>
      {data.subjects.map((subject, index) => {
        if (index == data.subjects.length - 1) {
          return (
          <View key={uuid4()}>
            <Subject data={subject} key={uuid4()} />
          </View>
          );
        }
        return (
          <View key={uuid4()}>
            <Subject data={subject} key={uuid4()} />
            <View
              style={{
                borderBottomColor: '#1c1c1c',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              key={uuid4()}
            />
          </View>
        );
      })}

    </View>
  );
};

export default Trimester;