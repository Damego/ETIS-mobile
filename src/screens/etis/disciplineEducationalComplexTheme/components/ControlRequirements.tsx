import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const ControlRequirementsBottomSheet = React.forwardRef<BottomSheetModal, { readonly data: string }>(
  ({ data }, ref) => {
    const { t } = useTranslation();
    return (
      <BottomSheetModal ref={ref}>
        <BottomSheetContent title={t('dec.control')}>
          <Text style={fontSize.medium}>{data}</Text>
        </BottomSheetContent>
      </BottomSheetModal>
    );
  }
);

const ControlRequirements = ({ data }: { readonly data: string }) => {
  const { t } = useTranslation();
  const ref = useRef<BottomSheetModal | null>(null);

  return (
    <>
      <SectionRow label={t('dec.control')} onPress={() => ref.current?.present()} />
      <ControlRequirementsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default ControlRequirements;
