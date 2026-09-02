import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { IExamQuestions } from '~/models/disciplineEducationalComplex';
import { RequestType } from '~/models/results';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const Question = ({ question, index }: { question: IExamQuestions; index: number }) => {
  const client = useClient();

  // Не требует авторизации в ЕТИС, поэтому несущественно, что здесь использовать
  const { data } = useQuery({
    queryFn: () =>
      client.getExamQuestions({ data: question.id, requestType: RequestType.tryFetch }),
    queryKey: ['examQuestions', question.id],
  });

  return (
    <Text style={fontSize.medium}>
      <Text style={{ fontWeight: 'bold' }}>
        {index + 1}. {question.title}
      </Text>
      {Boolean(data?.data) && `\n${data.data}`}
    </Text>
  );
};

const QuestionsBottomSheet = React.forwardRef<BottomSheetModal, { questions: IExamQuestions[] }>(
  ({ questions }, ref) => (
    <BottomSheetModal ref={ref}>
      <BottomSheetContent title='Вопросы промежуточной аттестации'>
        {questions.map((question, index) => (
          <Question question={question} index={index} key={question.id} />
        ))}
      </BottomSheetContent>
    </BottomSheetModal>
  )
);

const ExamQuestions = ({ questions }: { questions: IExamQuestions[] }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <SectionRow
        label='Вопросы промежуточной аттестации'
        onPress={() => ref.current.present()}
      />
      <QuestionsBottomSheet ref={ref} questions={questions} />
    </>
  );
};

export default ExamQuestions;
