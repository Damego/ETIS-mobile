import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderLine from '../../components/BorderLine';

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

const SubjectInfo = ({ classWork, soloWork, total }) => (
  <View style={styles.subjectInfoView}>
    <Text style={[styles.font15, styles.boldText]}>Трудоёмкость:</Text>

    <Text style={styles.font15}>
      Аудиторная работа: {classWork} часов ({classWork / 2} пар)
    </Text>
    <Text style={styles.font15}>
      Самостоятельная работа: {soloWork} часов ({soloWork / 2} пар)
    </Text>
    <Text style={styles.font15}>
      Всего: {total} часов ({total / 2} пар)
    </Text>
  </View>
);

const Subject = ({ data: { subject, reporting, classWork, soloWork, total }, showBorderLine }) => {
  const [isOpened, setOpened] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={styles.subjectDropdownView}
        activeOpacity={0.45}
      >
        <View style={styles.subjectTitleView}>
          <Text style={styles.subjectNameText}>{subject}</Text>
          <Text style={styles.subjectReportingText}>Отчётность: {reporting}</Text>
        </View>

        <AntDesign name={isOpened ? 'up' : 'down'} size={18} color="black" />
      </TouchableOpacity>

      {isOpened && <SubjectInfo classWork={classWork} soloWork={soloWork} total={total} />}
      {showBorderLine && <BorderLine />}
    </>
  );
};

export default Subject;
