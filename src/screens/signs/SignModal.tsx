import React from 'react';
import {
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { ICheckPoint, ISubject } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';
import { getCheckPointScore } from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

const styles = StyleSheet.create({
  modalCloseText: {
    position: 'absolute',
    bottom: '2%',
    width: '100%',
    alignItems: 'center',
  },
  modalRowStyle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  modalRootStyle: {
    alignItems: 'center',
    flex: 1,
    marginVertical: '20%',
    marginHorizontal: '2%',
    height: '100%',
  },
  scrollContainer: {
    width: '90%',
    gap: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

const Row = ({
  first,
  second,
  style,
}: {
  first: any;
  second?: any;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.modalRowStyle, style]}>
      <Text style={useGlobalStyles().textColor}>{first}</Text>
      <Text style={useGlobalStyles().textColor}>{second}</Text>
    </View>
  );
};

export default function SignModal({
  subject,
  closeModal,
}: {
  subject: ISubject;
  closeModal: () => void;
}) {
  const globalStyles = useGlobalStyles();

  const getCheckpointTitle = (theme: string, number: number) => {
    return `КТ ${number}: ${theme}`;
  };

  return (
    <Modal transparent onRequestClose={closeModal}>
      <View
        style={[
          styles.modalRootStyle,
          globalStyles.block,
          globalStyles.border,
          globalStyles.shadow,
        ]}
      >
        <View style={{ marginBottom: '12%', width: '100%' }}>
          <ScrollView
            style={{ width: '100%', marginVertical: '2%' }}
            contentContainerStyle={styles.scrollContainer}
          >
            <Text
              style={[
                globalStyles.textColor,
                fontSize.large,
                { marginTop: 5, textAlign: 'center' },
              ]}
            >
              {subject.name}
            </Text>
            <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
            {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
              <CardHeaderIn
                key={index}
                style={{ alignSelf: 'stretch' }}
                topText={getCheckpointTitle(checkPoint.theme, index + 1)}
              >
                <Row first={'Оценка: '} second={getCheckPointScore(checkPoint)} />
                <Row first={'Проходной балл: '} second={checkPoint.passScore} />
                <Row first={'Текущий балл: '} second={checkPoint.currentScore} />
                <Row first={'Максимальный балл: '} second={checkPoint.maxScore} />
                <Row first={`Вид работы: ${checkPoint.typeWork}`} />
                <Row first={`Вид контроля: ${checkPoint.typeControl}`} />
                {checkPoint.teacher && (
                  <>
                    <Row first={`Преподаватель: ${checkPoint.teacher}`} />
                    <Row first={`Дата: ${checkPoint.date}`} />
                  </>
                )}
                
              </CardHeaderIn>
            ))}
          </ScrollView>
        </View>
        <ClickableText
          onPress={closeModal}
          text={'Закрыть'}
          viewStyle={styles.modalCloseText}
          textStyle={[globalStyles.textColor, fontSize.medium]}
        />
      </View>
    </Modal>
  );
}
