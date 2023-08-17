import { Text, View } from 'react-native';

import Card from '../../components/Card';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { IAnswer, IQuestion } from '../../models/sessionQuestionnaire';
import { fontSize } from '../../utils/texts';

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
      <Text style={[fontSize.large, globalStyles.textColor]}>{question.name}</Text>

      <View style={{ marginTop: '2%' }}>
        {question.answers.map((answer, index) => (
          <Card key={answerTitles[index]}>
            <ClickableText
              text={answerTitles[index]}
              onPress={() => onAnswer(answer)}
              textStyle={[fontSize.large, globalStyles.textColor]}
              viewStyle={{ justifyContent: 'center', alignItems: 'center' }}
            />
          </Card>
        ))}
      </View>
    </View>
  );
}
