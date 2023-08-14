import React, { useEffect, useRef, useState } from 'react';
import { Button, ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch } from '../../hooks';
import { GetResultType } from '../../models/results';
import { ISessionTest, ISessionTestAnswer } from '../../models/sessionTest';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import TeacherQuestionView from './TeacherQuestionView';
import Theme from './Theme';

export default function SessionTest({ route }) {
  const dispatch = useAppDispatch();
  const { url } = route.params;
  const [data, setData] = useState<ISessionTest>();
  const [step, setStep] = useState(1);
  const [themeIndex, setThemeIndex] = useState(0);
  const teacherRef = useRef<string>();
  const answersRef = useRef<ISessionTestAnswer[]>([]);
  const client = getWrappedClient();

  const loadData = async () => {
    const result = await client.getSessionTest(url);

    if (result.type === GetResultType.loginPage) {
      return dispatch(setAuthorizing(false));
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const setTeacher = (name: string) => {
    teacherRef.current = name;
  };

  const onThemeAnswer = (answers: ISessionTestAnswer[]) => {
    answersRef.current = [...answersRef.current, ...answers];
    setThemeIndex(themeIndex + 1);
    setStep(2);
  };

  const onButtonClick = () => {
    setStep((prevState) => prevState + 1);
  };

  if (!data) return <LoadingScreen />;

  /*
  1. Ввод преподавателя
  2. Показ темы
  3. Показ вопроса с 5 вариантами ответов
  4. Продолжать до конца темы
  5. Начать с п.2 до окончания тем
  6. Отправка результатов
  */

  let component: React.ReactNode;
  if (step === 1) {
    component = <TeacherQuestionView teacher={data.teacher.name} setTeacher={setTeacher} />;
  } else if (step === 2 || step === 3) {
    component = (
      <Theme theme={data.themes[themeIndex]} showTitle={step === 3} onSubmit={onThemeAnswer} />
    );
  }

  return (
    <Screen>
      {component}
      <Button onPress={onButtonClick} disabled={false} title={'Dalee'} />
    </Screen>
  );
}
