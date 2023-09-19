import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';
import SignModal from './SignModal';
import SubjectCheckPoints from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

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
  markNumberText: {
    fontWeight: '600',
  },
  markView: {
    marginTop: '1%',
    alignItems: 'flex-end',
  },
  markWordText: {
    fontWeight: '600',
    marginRight: 10
  },
  detailsText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    textDecorationLine: 'underline',
  },
});

interface CardSignProps {
  subject: ISubject;
}

const CardSign = ({ subject }: CardSignProps) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  const closeModal = () => setOpened(false);
  const openModal = () => setOpened(true);

  return (
    <>
      {isOpened && <SignModal subject={subject} closeModal={closeModal} />}
      <CardHeaderIn topText={subject.name}>
        <View style={styles.pointsView}>
          <View>
            <SubjectCheckPoints data={subject.checkPoints} />
          </View>
          <TotalPoints subject={subject} style={styles.totalPoints} />
        </View>
        <View style={styles.pointsView}>
          <ClickableText
            text={'Подробнее...'}
            onPress={openModal}
            textStyle={[fontSize.medium, globalStyles.textColor, styles.detailsText]}
          />
          {subject.mark !== null && (
            <View style={styles.markView}>
              <Text style={[fontSize.medium, styles.markWordText, globalStyles.textColor]}>
                Оценка: {subject.mark}
              </Text>
            </View>
          )}
        </View>
      </CardHeaderIn>
    </>
  );
};

export default CardSign;
