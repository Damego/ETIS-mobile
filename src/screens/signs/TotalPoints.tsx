import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { HalloweenEmoji } from '../../components/HalloweenDecoration';
import Text from '../../components/Text';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { ThemeType } from '../../styles/themes';
import { fontSize, getPointsWord } from '../../utils/texts';

const styles = StyleSheet.create({
  colorMark2: {
    color: '#CE2539',
  },
  colorMark3: {
    color: '#f6d832',
  },
  colorMark4: {
    color: '#76c248',
  },
  colorMark5: {
    color: '#5c9f38',
  },
});

const getSubjectPointsStyle = (
  subject: ISubject,
  defaultTextStyle: StyleProp<TextStyle>
): StyleProp<TextStyle> => {
  if (subject.checkPoints.length === 0) return defaultTextStyle;

  let textStyle: StyleProp<TextStyle>;
  subject.checkPoints.every((checkPoint) => {
    if (!checkPoint.isIntroductionWork) {
      if (checkPoint.failed) {
        textStyle = styles.colorMark2;
        return false;
      }
      if (!checkPoint.hasPoints) {
        textStyle = defaultTextStyle;
      }
    }
    return true;
  });

  if (textStyle) return textStyle;

  if (subject.totalPoints === 0) return defaultTextStyle;
  if (subject.totalPoints < 61) return styles.colorMark3;
  if (subject.totalPoints < 81) return styles.colorMark4;
  return styles.colorMark5;
};

const TotalPoints = ({
  subject,
  style,
  isInBlock,
}: {
  subject: ISubject;
  style?: StyleProp<ViewStyle>;
  isInBlock?: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const { theme } = useAppSelector((state) => state.settings);
  const [showPoint, setShowPoint] = useState<boolean>(theme !== ThemeType.halloween);

  const textStyle = getSubjectPointsStyle(
    subject,
    isInBlock ? globalStyles.fontColorForBlock : globalStyles.textColor
  );
  const pointsWord = getPointsWord(subject.totalPoints);

  return showPoint ? (
    <View style={style}>
      <Text style={[fontSize.xxlarge, { fontWeight: '600' }, textStyle]}>
        {subject.totalPoints}
      </Text>
      <Text
        style={[fontSize.medium, { fontWeight: '600' }]}
        colorVariant={isInBlock ? 'block' : undefined}
      >
        {pointsWord}
      </Text>
    </View>
  ) : (
    <TouchableOpacity style={style} onPress={() => setShowPoint(true)}>
      <HalloweenEmoji />
    </TouchableOpacity>
  );
};

export default TotalPoints;
