import React from 'react';
import { View } from 'react-native';

import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { IAnswer, IQuestion } from '~/models/sessionQuestionnaire';
import { fontSize } from '~/utils/texts';

export default function Question({
  question,
  answerTitles,
  onAnswer,
}: {
  question: IQuestion;
  answerTitles: string[];
  onAnswer(answer: IAnswer): void;
}) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.large, { height: '40%' }]}>{question.name}</Text>

      <View style={{ marginTop: '2%', height: '60%' }}>
        {question.answers.map((answer, index) => (
          <Card key={answerTitles[index]}>
            <ClickableText
              text={answerTitles[index]}
              onPress={() => onAnswer(answer)}
              textStyle={fontSize.large}
              viewStyle={{ justifyContent: 'center', alignItems: 'center' }}
              colorVariant={'block'}
            />
          </Card>
        ))}
      </View>
    </View>
  );
}
