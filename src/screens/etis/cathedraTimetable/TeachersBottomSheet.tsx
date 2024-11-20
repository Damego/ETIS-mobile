import { AntDesign } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import Card from '~/components/Card';
import Text from '~/components/Text';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import { useGlobalStyles } from '~/hooks';
import { ITeacher, ITimeTable } from '~/models/timeTable';
import { fontSize } from '~/utils/texts';

const TeachersBottomSheet = ({
  selectedTeacher,
  timetable,
  onTeacherSelect,
}: {
  selectedTeacher: ITeacher;
  timetable: ITimeTable[];
  onTeacherSelect: (teacherId: string) => void;
}) => {
  const globalStyles = useGlobalStyles();
  const modalRef = useRef<BottomSheetModal>();
  const options = timetable.map((tt) => ({
    label: tt.teacher.name,
    value: tt.teacher.id,
    isCurrent: selectedTeacher.id === tt.teacher.id,
  }));

  return (
    <>
      <TouchableOpacity onPress={() => modalRef.current.present()} style={{ marginBottom: '2%' }}>
        <Card
          style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
        >
          <Text style={[fontSize.medium, { fontWeight: '500' }]}>{selectedTeacher.name}</Text>
          <AntDesign name={'swap'} size={22} color={globalStyles.textColor.color} />
        </Card>
      </TouchableOpacity>
      <OptionsBottomSheet ref={modalRef} options={options} onOptionPress={onTeacherSelect} />
    </>
  );
};

export default TeachersBottomSheet;
