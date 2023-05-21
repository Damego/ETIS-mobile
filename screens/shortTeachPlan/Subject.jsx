import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  subjectDropdownView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitleView: {
    maxWidth: '90%',
  },
  subjectNameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subjectReportingText: {
    fontSize: 16,
  },
  subjectInfoView: {
    marginLeft: '2%',
    marginBottom: '2%',
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

const Subject = ({ data: { subject, reporting, classWork, soloWork, total } }) => {
  const [isOpened, setOpened] = useState(false);

  return (
    <>
      <View style={styles.subjectDropdownView}>
        <View style={styles.subjectTitleView}>
          <Text style={styles.subjectNameText}>{subject}</Text>
          <Text style={styles.subjectReportingText}>Отчётность: {reporting}</Text>
        </View>

        <TouchableOpacity onPress={() => setOpened(!isOpened)}>
          <AntDesign name={isOpened ? 'up' : 'down'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isOpened ? <SubjectInfo classWork={classWork} soloWork={soloWork} total={total} /> : ''}
    </>
  );
};

export default Subject;
