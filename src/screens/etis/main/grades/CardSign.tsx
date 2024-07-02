import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { ICheckPoint, ISubject } from '~/models/sessionPoints';
import { fontSize } from '~/utils/texts';

import CheckPointDetails from './CheckPointDetails';
import SubjectCheckPoints from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

const CardSign = ({ subject }: { subject: ISubject }) => {
  const globalStyles = useGlobalStyles();
  const ref = useRef<BottomSheetModal>();

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.subjectNameText}>{subject.name}</Text>
      <View style={styles.pointsView}>
        <TouchableOpacity
          onPress={() => ref.current.present()}
          activeOpacity={0.45}
          style={[globalStyles.card, { padding: '2%' }]}
        >
          <SubjectCheckPoints data={subject.checkPoints} />
        </TouchableOpacity>
        <TotalPoints subject={subject} style={styles.totalPoints} isInBlock />
      </View>
      <View>
        {subject.mark !== null && (
          <View style={styles.markView}>
            <Text style={[fontSize.medium, styles.markWordText]}>Оценка: {subject.mark}</Text>
          </View>
        )}
      </View>
      <BottomSheetModal ref={ref} onDismiss={() => ref.current.dismiss()} snapPoints={['50%']}>
        <BottomSheetScrollView>
          <View style={styles.header}>
            <Text style={[fontSize.large, { flex: 1 }]}>{subject.name}</Text>
            <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
          </View>

          {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
            <CheckPointDetails checkPoint={checkPoint} index={index} key={index} />
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default CardSign;

const styles = StyleSheet.create({
  pointsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPoints: {
    alignItems: 'center',
    width: '25%',
  },
  markView: {
    marginTop: '1%',
    alignItems: 'flex-end',
  },
  markWordText: {
    fontWeight: '600',
    marginRight: 10,
  },
  subjectNameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
    marginBottom: '2%',
    gap: 5,
  },
});
