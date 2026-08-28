import { BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import React, { useRef } from 'react';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { IEvaluationIndicators } from '~/models/disciplineEducationalComplex';
import DropdownText from '~/screens/etis/disciplineEducationalComplex/components/DropdownText';
import RightIcon from '~/screens/etis/disciplineEducationalComplex/RightIcon';
import { fontSize } from '~/utils/texts';

const EvaluationIndicatorsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { data: IEvaluationIndicators }
>(({ data }, ref) => (
  <BottomSheetModal ref={ref} style={{ paddingHorizontal: '2%' }}>
    <BottomSheetScrollView style={{ paddingBottom: '4%' }}>
      <View>
        <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
          Промежуточный контроль: <Text>{data.control}</Text>
        </Text>
        <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
          Способ проведения: <Text>{data.method}</Text>
        </Text>
        <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
          Продолжительность промежуточного контроля: <Text>{data.duration}</Text>
        </Text>
      </View>

      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Критерии:</Text>
      {data.criteria.map((criteria, index) => (
        <React.Fragment key={index}>
          <DropdownText title={criteria.title} value={criteria.description} />
          {data.criteria.length - 1 !== index && <BorderLine />}
        </React.Fragment>
      ))}
    </BottomSheetScrollView>
  </BottomSheetModal>
));

const EvaluationIndicators = ({ data }: { data: IEvaluationIndicators }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<RightIcon />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Показатели оценивания
      </ClickableText>
      <EvaluationIndicatorsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default EvaluationIndicators;
