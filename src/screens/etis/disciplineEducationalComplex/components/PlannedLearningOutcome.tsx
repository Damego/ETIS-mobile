import { AntDesign } from '@expo/vector-icons';
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View } from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { IPlannedLearningOutcome } from '~/models/disciplineEducationalComplex';
import { RIGHT_ICON_SIZE } from '~/screens/etis/disciplineEducationalComplex/components/common';
import { fontSize } from '~/utils/texts';

const Outcome = ({ data }: { data: IPlannedLearningOutcome }) => {
  return (
    <View>
      <Text>{data.outcome}</Text>
      {data.criteria.map((criteria, index) => (
        <React.Fragment key={index}>
          <Text style={{ fontWeight: 'bold' }}>{criteria.title}</Text>
          <Text>{criteria.description}</Text>
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
    <BottomSheetModal ref={ref}>
      <BottomSheetScrollView>
        {data.map(($data, index) => (
          <Outcome data={$data} key={index} />
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
        iconRight={<AntDesign name={'right'} size={RIGHT_ICON_SIZE} />}
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
