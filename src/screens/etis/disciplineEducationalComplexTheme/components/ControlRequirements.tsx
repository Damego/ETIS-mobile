import { BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import React, { useRef } from 'react';

import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import RightIcon from '~/screens/etis/disciplineEducationalComplex/RightIcon';
import { fontSize } from '~/utils/texts';

const ControlRequirementsBottomSheet = React.forwardRef<BottomSheetModal, { data: string }>(
  ({ data }, ref) => (
    <BottomSheetModal ref={ref} style={{ paddingHorizontal: '2%' }}>
      <BottomSheetScrollView style={{ paddingBottom: '4%' }}>
        <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Контроль</Text>
        <Text>{data}</Text>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
);

const ControlRequirements = ({ data }: { data: string }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<RightIcon />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Контроль
      </ClickableText>
      <ControlRequirementsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default ControlRequirements;
