import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { parseTeachers } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { httpClient } from '../../utils';
import Teacher from './Teacher';

const TeacherTable = () => {
  const { toggleSignIn } = useContext(AuthContext);
  const [data, setData] = useState(null);

  const loadData = async () => {
    let html;
    html = await httpClient.getTeachers();
    if (!html) {
      return;
    }

    if (isLoginPage(html)) {
      toggleSignIn(true);
      return;
    }

    const parsedData = parseTeachers(html);
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Преподаватели" />;

  return (
    <Screen headerText="Преподаватели" onUpdate={loadData}>
      {data.map(([key, value]) => (
        <CardHeaderOut key={key} topText={key}>
          {value.map((teacher, index) => (
            <View key={teacher.name}>
              <Teacher data={teacher} />
              {index !== value.length - 1 ? <BorderLine /> : ''}
            </View>
          ))}
        </CardHeaderOut>
      ))}
    </Screen>
  );
};

export default TeacherTable;
