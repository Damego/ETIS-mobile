import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  markNeutral: {
    fontSize: 16,
    fontWeight: '600',
  },
  markFail: {
    color: '#CE2539',
    fontSize: 16,
    fontWeight: '600',
  },
});

const Subject = ({ data }) => (
  <View>
    {data.info.map((info, index) => {
      const theme = `КТ ${index + 1}`;

      let markText;
      if (info.isAbsent) markText = 'н';
      else if (Number.isNaN(info.mark)) markText = '-';
      else markText = info.mark;

      return (
        <Text
          style={
            (Number.isNaN(info.mark) && info.isAbsent || info.mark < info.passScore) &&
              (info.maxScore !== 0.0)
              ? styles.markFail
              : styles.markNeutral
          }
          key={info.theme}
        >{`${theme}: ${markText} / ${info.passScore} / ${info.maxScore}`}</Text>
      );
    })}
  </View>
);

export default Subject;
