import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { IAnswer, ITheme } from '../../models/sessionQuestionnaire';
import { fontSize } from '../../utils/texts';
import Question from './Question';
import { useGlobalStyles } from '../../hooks';

export default function Theme({
  theme,
  showTitle,
  onSubmit,
}: {
  theme: ITheme;
  showTitle: boolean;
  onSubmit(answers: IAnswer[]): void;
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
        <Text style={[fontSize.large, globalStyles.textColor]}>{theme.title}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Question
        question={theme.questions[questionIndex]}
        answerTitles={theme.answerTitles}
        onAnswer={onQuestionAnswer}
      />
    </View>
  );
}
