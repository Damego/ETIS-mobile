import React, { useRef } from 'react';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import { IEvaluationIndicators } from '~/models/disciplineEducationalComplex';
import DropdownText from '~/screens/etis/disciplineEducationalComplex/components/DropdownText';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const EvaluationIndicatorsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { data: IEvaluationIndicators }
>(({ data }, ref) => (
  <BottomSheetModal ref={ref}>
    <BottomSheetContent title='Показатели оценивания'>
      <View style={{ gap: 4 }}>
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
    </BottomSheetContent>
  </BottomSheetModal>
));

const EvaluationIndicators = ({ data }: { data: IEvaluationIndicators }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <SectionRow label='Показатели оценивания' onPress={() => ref.current.present()} />
      <EvaluationIndicatorsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default EvaluationIndicators;
