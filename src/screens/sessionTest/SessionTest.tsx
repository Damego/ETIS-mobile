import React, { useEffect, useRef, useState } from 'react';
import { Button, Text, ToastAndroid, View } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { GetResultType } from '../../models/results';
import { ISessionTest, ISessionTestAnswer } from '../../models/sessionTest';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import AdditionalComment from './AdditionalComment';
import TeacherQuestionView from './TeacherQuestionView';
import Theme from './Theme';
import { httpClient } from '../../utils';

enum Steps {
  inputTeacher = 1,
  showThemeTitle,
  showThemeQuestions,
  inputAdditionalComment,
  sendResult,
}

export default function SessionTest({ route }) {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const { url } = route.params;
  const [data, setData] = useState<ISessionTest>();
  const [step, setStep] = useState<Steps>(1);
  const [themeIndex, setThemeIndex] = useState(0);
  const teacherRef = useRef<string>();
  const answersRef = useRef<ISessionTestAnswer[]>([]);
  const additionalCommentRef = useRef<string>();
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

  const setAdditionalComment = (text: string) => {
    additionalCommentRef.current = text;
  };

  const onThemeAnswer = (answers: ISessionTestAnswer[]) => {
    answersRef.current = [...answersRef.current, ...answers];

    if (themeIndex + 1 === data.themes.length) {
      setStep(Steps.inputAdditionalComment);
      return;
    }

    setThemeIndex((prevState) => prevState + 1);
    setStep(Steps.showThemeTitle);
  };

  const onButtonClick = () => {
    if (step + 1 === Steps.sendResult) {
      await httpClient.sendRecoveryMail()
    } else {
      setStep((prevState) => prevState + 1);
    }
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
  if (step === Steps.inputTeacher) {
    component = <TeacherQuestionView teacher={data.teacher.name} setTeacher={setTeacher} />;
  } else if (step === Steps.showThemeTitle || step === Steps.showThemeQuestions) {
    component = (
      <Theme theme={data.themes[themeIndex]} showTitle={step === Steps.showThemeTitle} onSubmit={onThemeAnswer} />
    );
  } else if (step === Steps.inputAdditionalComment) {
    component = <AdditionalComment onTextChange={setAdditionalComment} />;
  } else if (step === Steps.sendResult) {}

  return (
    <Screen>
      {component}
      <View style={{ marginVertical: '5%' }}>
        <Button
          onPress={onButtonClick}
          disabled={step === Steps.showThemeQuestions}
          title={'Далее'}
          color={globalStyles.primaryFontColor.color}
        />
      </View>
    </Screen>
  );
}
