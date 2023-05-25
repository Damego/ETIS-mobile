import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import { useGlobalStyles } from '../../hooks';

const styles = StyleSheet.create({
  subjectDropdownView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitleView: {
    flex: 1,
  },
  subjectNameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subjectReportingText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  font15: {
    fontSize: 15,
  },
});

const SubjectInfo = ({ classWork, soloWork, total }) => {
  const globalStyles = useGlobalStyles();
  const textStyles = [styles.font15, globalStyles.textColor];

  return (
    <View style={styles.subjectInfoView}>
      <Text style={[...textStyles, styles.boldText]}>Трудоёмкость:</Text>

      <Text style={textStyles}>
        Аудиторная работа: {classWork} часов ({classWork / 2} пар)
      </Text>
      <Text style={textStyles}>
        Самостоятельная работа: {soloWork} часов ({soloWork / 2} пар)
      </Text>
      <Text style={textStyles}>
        Всего: {total} часов ({total / 2} пар)
      </Text>
    </View>
  );
};

const Subject = ({ data: { subject, reporting, classWork, soloWork, total }, showBorderLine }) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={styles.subjectDropdownView}
        activeOpacity={0.45}
      >
        <View style={[styles.subjectTitleView, globalStyles.textColor]}>
          <Text style={[styles.subjectNameText, globalStyles.textColor]}>{subject}</Text>
          <Text style={[styles.subjectReportingText, globalStyles.textColor]}>
            Отчётность: {reporting}
          </Text>
        </View>

        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>

      {isOpened && <SubjectInfo classWork={classWork} soloWork={soloWork} total={total} />}
      {showBorderLine && <BorderLine />}
    </>
  );
};

export default Subject;
