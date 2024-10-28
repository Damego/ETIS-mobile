import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { View } from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { IExamQuestions } from '~/models/disciplineEducationalComplex';
import { RequestType } from '~/models/results';
import RightIcon from '~/screens/etis/disciplineEducationalComplex/RightIcon';
import { fontSize } from '~/utils/texts';

const Question = ({ question }: { question: IExamQuestions }) => {
  const client = useClient();

  // Не требует авторизации в ЕТИС, поэтому несущественно, что здесь использовать
  const { data } = useQuery({
    queryFn: () =>
      client.getExamQuestions({ data: question.id, requestType: RequestType.tryFetch }),
    queryKey: ['examQuestions', question.id],
  });

  return (
    <View>
      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>{question.title}</Text>
      {data?.data && <Text>{data?.data}</Text>}
    </View>
  );
};

const QuestionsBottomSheet = React.forwardRef<BottomSheetModal, { questions: IExamQuestions[] }>(
  ({ questions }, ref) => {
    return (
      <BottomSheetModal ref={ref} style={{ padding: '2%' }}>
        <Text style={[fontSize.slarge, { fontWeight: 'bold', textAlign: 'center' }]}>
          Вопросы промежуточной аттестации
        </Text>

        <BottomSheetScrollView>
          {questions.map((question) => (
            <Question question={question} key={question.id} />
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const ExamQuestions = ({ questions }: { questions: IExamQuestions[] }) => {
  const ref = useRef<BottomSheetModal>();

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<RightIcon />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Вопросы промежуточной аттестации
      </ClickableText>
      <QuestionsBottomSheet ref={ref} questions={questions} />
    </>
  );
};

export default ExamQuestions;
