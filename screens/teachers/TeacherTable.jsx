import React, { useEffect, useState } from 'react';
import 'react-native-get-random-values';

import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { httpClient, parser } from '../../utils';
import Teacher from './Teacher';

const TeacherTable = () => {
  const [data, setData] = useState(null);

  const loadData = async () => {
    let html;
    html = await httpClient.getTeachers();
    if (!html) {
      return;
    }
    const parsedData = parser.parseTeachers(html);

    const dataGrouped = {};
    parsedData.forEach((val) => {
      if (dataGrouped[val.subjectUntyped]) {
        dataGrouped[val.subjectUntyped].push(val);
      } else {
        dataGrouped[val.subjectUntyped] = [val];
      }
    });
    setData(Object.entries(dataGrouped));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Преподаватели" />;

  return (
    <Screen headerText="Преподаватели" onUpdate={loadData}>
      {data.map(([key, value]) => (
        <CardHeaderOut key={key} topText={key}>
          {value.map((teacher) => (
            <Teacher key={teacher.name} data={teacher} />
          ))}
        </CardHeaderOut>
      ))}
    </Screen>
  );
};

export default TeacherTable;