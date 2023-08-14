import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ISessionTestAnswer, ISessionTestTheme } from '../../models/sessionTest';
import Question from './Question';
import { fontSize } from '../../utils/texts';

export default function Theme({
  theme,
  showTitle,
  onSubmit,
}: {
  theme: ISessionTestTheme;
  showTitle: boolean;
  onSubmit(answers: ISessionTestAnswer[]): void;
}) {
  const [answers, setAnswers] = useState<ISessionTestAnswer[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const addAnswer = (answer: ISessionTestAnswer) => {
    setAnswers([...answers, answer]);
  };
  const onQuestionAnswer = (answer: ISessionTestAnswer) => {
    addAnswer(answer);
    setQuestionIndex(questionIndex + 1);
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[fontSize.large]}>{theme.title}</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Question
        question={theme.questions[questionIndex]}
        answerTitles={theme.answerTitles}
        onAnswer={onQuestionAnswer}
      />
    </View>
  );
}
