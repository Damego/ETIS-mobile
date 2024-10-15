import { AntDesign } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import FileTextLink from '~/components/FileTextLink';
import Text from '~/components/Text';
import { IAdditionalMaterials } from '~/models/disciplineEducationalComplex';
import { RIGHT_ICON_SIZE } from '~/screens/etis/disciplineEducationalComplex/components/common';
import { fontSize } from '~/utils/texts';

const AdditionalMaterialsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { data: IAdditionalMaterials }
>(({ data }, ref) => {
  return (
    <BottomSheetModal ref={ref} style={{ paddingHorizontal: '2%' }}>
      <BottomSheetScrollView style={{ paddingBottom: '4%' }}>
        <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Файлы</Text>
        {data.files.map((file, index) => (
          <FileTextLink src={file.uri} fileName={file.name} key={index} style={fontSize.medium}>
            {file.name}
          </FileTextLink>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const AdditionalMaterials = ({ data }: { data: IAdditionalMaterials }) => {
  const ref = useRef<BottomSheetModal>();

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<AntDesign name={'right'} size={RIGHT_ICON_SIZE} />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Дополнительные материалы
      </ClickableText>
      <AdditionalMaterialsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default AdditionalMaterials;
