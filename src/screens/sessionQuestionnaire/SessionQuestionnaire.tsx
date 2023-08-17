import React, { useEffect, useRef, useState } from 'react';
import { Button, ToastAndroid, View } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { GetResultType } from '../../models/results';
import { IAnswer, ISessionQuestionnaire } from '../../models/sessionQuestionnaire';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import toSessionTestPayload from '../../utils/sessionTest';
import AdditionalComment from './AdditionalComment';
import { ConfirmResultView, ResultSentView, SendingResultView } from './ResultViews';
import TeacherQuestionView from './TeacherQuestionView';
import Theme from './Theme';

enum Steps {
  inputTeacher = 1,
  showThemeTitle,
  showThemeQuestions,
  inputAdditionalComment,
  confirmResult,
  sendResult,
  resultSent,
}

export default function SessionQuestionnaire({ route }) {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const { url } = route.params;
  const [data, setData] = useState<ISessionQuestionnaire>();
  const [step, setStep] = useState<Steps>(1);
  const [themeIndex, setThemeIndex] = useState(0);
  const teacherRef = useRef<string>();
  const answersRef = useRef<IAnswer[]>([]);
  const additionalCommentRef = useRef<string>();
  const client = getWrappedClient();

  const loadData = async () => {
    const result = await client.getSessionQuestionnaire(url);

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

  const onThemeAnswer = (answers: IAnswer[]) => {
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
      setStep(Steps.sendResult)
      const payload = toSessionTestPayload({
        data,
        answers: answersRef.current,
        teacher: teacherRef.current,
        additionalComment: additionalCommentRef.current,
      });
      httpClient.sendSessionQuestionnaireResult(payload).then(() => {
        setStep(Steps.resultSent);
      });
    } else {
      setStep((prevState) => prevState + 1);
    }
  };

  if (!data) return <LoadingScreen />;

  let component: React.ReactNode;
  if (step === Steps.inputTeacher) {
    component = <TeacherQuestionView teacher={data.teacher.name} setTeacher={setTeacher} />;
  } else if (step === Steps.showThemeTitle || step === Steps.showThemeQuestions) {
    component = (
      <Theme
        theme={data.themes[themeIndex]}
        showTitle={step === Steps.showThemeQuestions}
        onSubmit={onThemeAnswer}
      />
    );
  } else if (step === Steps.inputAdditionalComment) {
    component = <AdditionalComment onTextChange={setAdditionalComment} />;
  } else if (step === Steps.confirmResult) {
    component = <ConfirmResultView />;
  } else if (step === Steps.sendResult) {
    component = <SendingResultView />;
  } else if (step === Steps.resultSent) {
    component = <ResultSentView />;
  }

  const hideButton =
    step === Steps.showThemeQuestions || step === Steps.sendResult || step === Steps.resultSent;
  return (
    <Screen>
      {component}

      {!hideButton && (
        <View style={{ marginVertical: '5%' }}>
          <Button
            onPress={onButtonClick}
            title={'Далее'}
            color={globalStyles.primaryFontColor.color}
          />
        </View>
      )}
    </Screen>
  );
}
