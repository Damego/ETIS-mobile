import React, { useState } from 'react';
import { Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';
import SubjectCheckPoints from './SubjectCheckPoints';
import { Button } from '../../components/Button';
import SignModal from './SignModal';
import TotalPoints from './TotalPoints';
import styles from './styles';

interface CardSignProps {
  subject: ISubject;
}

const CardSign = ({ subject }: CardSignProps) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  const closeModal = () => setOpened(false);

  const openModal = () => {
    setOpened(true);
  };

  return (
    <>
    {isOpened && <SignModal subject={subject} closeModal={closeModal} />}
    <CardHeaderIn topText={subject.name}>
      <View style={styles.pointsView}>
        <View>
          <SubjectCheckPoints data={subject.checkPoints} />
          <Button text={'Подробнее...'} 
            onPress={openModal} 
            textStyle={[fontSize.medium, {paddingVertical: 3, paddingHorizontal: 10}]}
            viewStyle={{width: 'auto', height: 'auto'}}
            />
        </View>

        <TotalPoints subject={subject} style={styles.totalPoints} />
      </View>

      {subject.mark !== null && (
        <View style={styles.markView}>
          <Text style={[fontSize.medium, styles.markWordText, globalStyles.textColor]}>
            Оценка: {subject.mark}
          </Text>
        </View>
      )}
    </CardHeaderIn>
    </>
  );
};

export default CardSign;
