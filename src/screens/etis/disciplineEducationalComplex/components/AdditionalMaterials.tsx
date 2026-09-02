import React, { useRef } from 'react';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import FileTextLink from '~/components/FileTextLink';
import Text from '~/components/Text';
import { IAdditionalMaterials } from '~/models/disciplineEducationalComplex';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const AdditionalMaterialsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { data: IAdditionalMaterials }
>(({ data }, ref) => (
  <BottomSheetModal ref={ref}>
    <BottomSheetContent title='Дополнительные материалы'>
      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Файлы</Text>
      {data.files.map((file, index) => (
        <FileTextLink src={file.uri} fileName={file.name} key={index} style={fontSize.medium}>
          {file.name}
        </FileTextLink>
      ))}
    </BottomSheetContent>
  </BottomSheetModal>
));

const AdditionalMaterials = ({ data }: { data: IAdditionalMaterials }) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <SectionRow label='Дополнительные материалы' onPress={() => ref.current.present()} />
      <AdditionalMaterialsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default AdditionalMaterials;
