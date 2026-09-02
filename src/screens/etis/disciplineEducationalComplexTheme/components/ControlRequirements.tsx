import React, { useRef } from 'react';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const ControlRequirementsBottomSheet = React.forwardRef<BottomSheetModal, { data: string }>(
  ({ data }, ref) => (
    <BottomSheetModal ref={ref}>
      <BottomSheetContent title='Контроль'>
        <Text style={fontSize.medium}>{data}</Text>
      </BottomSheetContent>
    </BottomSheetModal>
  )
);

const ControlRequirements = ({ data }: { data: string }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <SectionRow label='Контроль' onPress={() => ref.current.present()} />
      <ControlRequirementsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default ControlRequirements;
