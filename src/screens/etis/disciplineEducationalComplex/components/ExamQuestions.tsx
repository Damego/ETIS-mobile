import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { IExamQuestions } from '~/models/disciplineEducationalComplex';
import { RequestType } from '~/models/results';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const Question = ({ question, index }: { readonly question: IExamQuestions; readonly index: number }) => {
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
      {Boolean(data?.data) && `\n${data?.data}`}
    </Text>
  );
};

const QuestionsBottomSheet = React.forwardRef<BottomSheetModal, { readonly questions: IExamQuestions[] }>(
  ({ questions }, ref) => {
    const { t } = useTranslation();
    return (
      <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
        <BottomSheetContent title={t('dec.examQuestions')}>
          {questions.map((question, index) => (
            <Question key={question.id} question={question} index={index} />
          ))}
        </BottomSheetContent>
      </BottomSheetModal>
    );
  }
);

const ExamQuestions = ({ questions }: { readonly questions: IExamQuestions[] }) => {
  const { t } = useTranslation();
  const ref = useRef<BottomSheetModal | null>(null);

  return (
    <>
      <SectionRow
        label={t('dec.examQuestions')}
        onPress={() => ref.current?.present()}
      />
      <QuestionsBottomSheet ref={ref} questions={questions} />
    </>
  );
};

export default ExamQuestions;
