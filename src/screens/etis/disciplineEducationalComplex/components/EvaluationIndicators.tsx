import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  { readonly data: IEvaluationIndicators }
>(({ data }, ref) => {
  const { t } = useTranslation();
  return (
    <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
      <BottomSheetContent title={t('dec.evaluationIndicators')}>
        <View style={{ gap: 4 }}>
          <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
            {t('dec.interimControl')}: <Text>{data.control}</Text>
          </Text>
          <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
            {t('dec.conductMethod')}: <Text>{data.method}</Text>
          </Text>
          <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
            {t('dec.interimControlDuration')}: <Text>{data.duration}</Text>
          </Text>
        </View>

        <Text style={[fontSize.big, { fontWeight: 'bold' }]}>{t('dec.criteria')}:</Text>
        {data.criteria.map((criteria, index) => (
          <React.Fragment key={index}>
            <DropdownText title={criteria.title} value={criteria.description} />
            {data.criteria.length - 1 !== index && <BorderLine />}
          </React.Fragment>
        ))}
      </BottomSheetContent>
    </BottomSheetModal>
  );
});

const EvaluationIndicators = ({ data }: { readonly data: IEvaluationIndicators }) => {
  const { t } = useTranslation();
  const ref = useRef<BottomSheetModal | null>(null);

  return (
    <>
      <SectionRow label={t('dec.evaluationIndicators')} onPress={() => ref.current?.present()} />
      <EvaluationIndicatorsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default EvaluationIndicators;
