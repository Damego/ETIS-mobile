import { AntDesign } from '@expo/vector-icons';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { View } from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { IExamQuestions } from '~/models/disciplineEducationalComplex';
import { RIGHT_ICON_SIZE } from '~/screens/etis/disciplineEducationalComplex/components/common';
import { httpClient } from '~/utils';
import { fontSize } from '~/utils/texts';

const Question = ({ question }: { question: IExamQuestions }) => {
  const { data, isLoading } = useQuery({
    queryFn: () => httpClient.getExamQuestions(question.id),
    queryKey: ['examQuestion', question.id],
  });

  return (
    <View>
      <Text>{question.title}</Text>
      {isLoading && <Text>{data?.data}</Text>}
    </View>
  );
};

const QuestionsBottomSheet = React.forwardRef<BottomSheetModal, { questions: IExamQuestions[] }>(
  ({ questions }, ref) => {
    return (
      <BottomSheetModal ref={ref}>
        <BottomSheetView>
          {questions.map((question) => (
            <Question question={question} key={question.id} />
          ))}
        </BottomSheetView>
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
        iconRight={<AntDesign name={'right'} size={RIGHT_ICON_SIZE} />}
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
