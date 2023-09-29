import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { IAnswer, ITheme } from '../../models/sessionQuestionnaire';
import { fontSize } from '../../utils/texts';
import Question from './Question';

export default function Theme({
  theme,
  showTitle,
  onSubmit,
  themeNumber,
  themeCount,
  answeredCount,
  questionCount,
}: {
  theme: ITheme;
  showTitle: boolean;
  onSubmit(answers: IAnswer[]): void;
  themeNumber: number;
  themeCount: number;
  answeredCount: number;
  questionCount: number;
}) {
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const globalStyles = useGlobalStyles();

  const addAnswer = (answer: IAnswer) => {
    setAnswers([...answers, answer]);
  };
  const onQuestionAnswer = (answer: IAnswer) => {
    addAnswer(answer);
    if (questionIndex + 1 === theme.questions.length) return;
    setQuestionIndex((prevState) => prevState + 1);
  };

  useEffect(() => {
    if (answers.length === theme.questions.length) {
      onSubmit(answers);
      setQuestionIndex(0);
      setAnswers([]);
    }
  }, [answers]);

  if (!showTitle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[fontSize.large, globalStyles.textColor, { fontWeight: '500' }]}>
          Тема {themeNumber} из {themeCount}
        </Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[fontSize.large, globalStyles.textColor]}>{theme.title}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={[fontSize.large, globalStyles.textColor, { marginBottom: '4%', fontWeight: '500' }]}
      >
        Вопрос {answeredCount + questionIndex + 1} из {questionCount}
      </Text>
      <Question
        question={theme.questions[questionIndex]}
        answerTitles={theme.answerTitles}
        onAnswer={onQuestionAnswer}
      />
    </View>
  );
}
