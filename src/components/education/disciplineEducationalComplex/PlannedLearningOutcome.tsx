import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import DropdownText from '~/components/education/disciplineEducationalComplex/DropdownText';
import RightIcon from '~/components/education/disciplineEducationalComplex/RightIcon';
import { IPlannedLearningOutcome } from '~/models/disciplineEducationalComplex';
import { fontSize } from '~/utils/texts';

const Outcome = ({ data }: { data: IPlannedLearningOutcome }) => {
  return (
    <View>
      <Text style={fontSize.medium}>{data.outcome}</Text>
      <Text style={[fontSize.big, { fontWeight: 'bold', marginBottom: '2%' }]}>Критерии</Text>
      {data.criteria.map((criteria, index) => (
        <React.Fragment key={index}>
          <DropdownText title={criteria.title} value={criteria.description} />
          {data.criteria.length - 1 !== index && <BorderLine />}
        </React.Fragment>
      ))}
    </View>
  );
};

const PlannedLearningOutcomeBottomSheet = React.forwardRef<
  BottomSheetModal,
  { data: IPlannedLearningOutcome[] }
>(({ data }, ref) => {
  return (
    <BottomSheetModal ref={ref} style={{ paddingHorizontal: '2%' }}>
      <Text style={[fontSize.slarge, { fontWeight: 'bold', textAlign: 'center' }]}>
        Планируемый результат обучения
      </Text>

      <BottomSheetScrollView>
        {data.map(($data, index) => (
          <View key={index} style={{ marginVertical: '2%', gap: 16 }}>
            <Outcome data={$data} />
            {index !== data.length - 1 && <BorderLine />}
          </View>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const PlannedLearningOutcome = ({ data }: { data: IPlannedLearningOutcome[] }) => {
  const ref = useRef<BottomSheetModal>();

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<RightIcon />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Планируемый результат обучения
      </ClickableText>
      <PlannedLearningOutcomeBottomSheet ref={ref} data={data} />
    </>
  );
};

export default PlannedLearningOutcome;
