import React, { useRef } from 'react';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import { IPlannedLearningOutcome } from '~/models/disciplineEducationalComplex';
import DropdownText from '~/screens/etis/disciplineEducationalComplex/components/DropdownText';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const Outcome = ({ data }: { data: IPlannedLearningOutcome }) => (
  <View style={{ gap: 4 }}>
    <Text style={fontSize.medium}>{data.outcome}</Text>
    <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Критерии</Text>
    {data.criteria.map((criteria, index) => (
      <React.Fragment key={index}>
        <DropdownText title={criteria.title} value={criteria.description} />
        {data.criteria.length - 1 !== index && <BorderLine />}
      </React.Fragment>
    ))}
  </View>
);

const PlannedLearningOutcomeBottomSheet = React.forwardRef<
  BottomSheetModal,
  { data: IPlannedLearningOutcome[] }
>(({ data }, ref) => (
  <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
    <BottomSheetContent title='Планируемый результат обучения'>
      {data.map(($data, index) => (
        <View key={index}>
          <Outcome data={$data} />
          {index !== data.length - 1 && <BorderLine />}
        </View>
      ))}
    </BottomSheetContent>
  </BottomSheetModal>
));

const PlannedLearningOutcome = ({ data }: { data: IPlannedLearningOutcome[] }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <SectionRow label='Планируемый результат обучения' onPress={() => ref.current.present()} />
      <PlannedLearningOutcomeBottomSheet ref={ref} data={data} />
    </>
  );
};

export default PlannedLearningOutcome;
