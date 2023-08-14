import { Text, View } from 'react-native';

import ClickableText from '../../components/ClickableText';
import { ISessionTestAnswer, ISessionTestQuestion } from '../../models/sessionTest';
import { fontSize } from '../../utils/texts';
import Card from '../../components/Card';

export default function Question({
  question,
  answerTitles,
  onAnswer,
}: {
  question: ISessionTestQuestion;
  answerTitles: string[];
  onAnswer(answer: ISessionTestAnswer): void;
}) {

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={fontSize.large}>{question.name}</Text>

      {question.answers.map((answer, index) => (
        <Card>
          <ClickableText
            key={answerTitles[index]}
            text={answerTitles[index]}
            onPress={() => onAnswer(answer)}
            textStyle={fontSize.large}
          />
        </Card>
      ))}
    </View>
  );
}
