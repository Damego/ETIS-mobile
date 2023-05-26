import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';

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

const SubjectCheckPoint = ({ data }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View>
      {data.map((info, index) => {
        const theme = `КТ ${index + 1}`;

        let markText;
        if (info.isAbsent) markText = 'н';
        else if (Number.isNaN(info.points)) markText = '-';
        else markText = info.points;

        return (
          <Text
            style={
              ((Number.isNaN(info.points) && info.isAbsent) || info.points < info.passScore) &&
              (!info.isIntroductionWork)
                ? styles.markFail
                : [styles.markNeutral, globalStyles.textColor]
            }
            key={info.theme}
          >{`${theme}: ${markText} / ${info.passScore} / ${info.maxScore}`}</Text>
        );
      })}
    </View>
  );
};

export default SubjectCheckPoint;