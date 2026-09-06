import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import { IPlannedLearningOutcome } from '~/models/disciplineEducationalComplex';
import DropdownText from '~/screens/etis/disciplineEducationalComplex/components/DropdownText';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const Outcome = ({ data }: { data: IPlannedLearningOutcome }) => {
  const { t } = useTranslation();
  return (
    <View style={{ gap: 4 }}>
      <Text style={fontSize.medium}>{data.outcome}</Text>
      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>{t('dec.criteria')}</Text>
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
  const { t } = useTranslation();
  return (
    <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
      <BottomSheetContent title={t('dec.plannedOutcome')}>
        {data.map(($data, index) => (
          <View key={index}>
            <Outcome data={$data} />
            {index !== data.length - 1 && <BorderLine />}
          </View>
        ))}
      </BottomSheetContent>
    </BottomSheetModal>
  );
});

const PlannedLearningOutcome = ({ data }: { data: IPlannedLearningOutcome[] }) => {
  const { t } = useTranslation();
  const ref = useRef<BottomSheetModal | null>(null);

  return (
    <>
      <SectionRow label={t('dec.plannedOutcome')} onPress={() => ref.current?.present()} />
      <PlannedLearningOutcomeBottomSheet ref={ref} data={data} />
    </>
  );
};

export default PlannedLearningOutcome;
