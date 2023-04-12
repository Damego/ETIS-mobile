import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {v4 as uuid4} from 'uuid';

import Subject from './Subject';

const Trimester = ({ data }) => {
  let totalHours = 0;

  return (
    <View>
      {data.subjects.map((subject) => {
        totalHours += subject.total;
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

      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      <View style={styles.totalHoursView}>
        <View>
          <Text style={styles.totalHoursText}>{`Всего часов: ${totalHours}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default Trimester;

const styles = StyleSheet.create({
  totalHoursView: {
    backgroundColor: '#ffb',
    paddingBottom: '1%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalHoursText: {
    fontSize: 14,
    textAlign: 'right',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
});
