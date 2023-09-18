import React from 'react';
import { Modal, ScrollView, StyleProp, Text, View, ViewStyle } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { ICheckPoint, ISubject } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';
import { getCheckPointScore } from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';
import styles from './styles';

const Row = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.modalRowStyle, style]}>{children}</View>;
};

const TextRow = ({ text, style }: { text: any; style?: StyleProp<ViewStyle> }) => {
  return (
    <Row style={style}>
      <Text style={useGlobalStyles().textColor}>{text}</Text>
    </Row>
  );
};

const DoubleTextRow = ({
  first,
  second,
  style,
}: {
  first: any;
  second: any;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <Row style={[{ justifyContent: 'space-between' }, style]}>
      <Text style={useGlobalStyles().textColor}>{first}</Text>
      <Text style={useGlobalStyles().textColor}>{second}</Text>
    </Row>
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
                { marginTop: '2%', textAlign: 'center' },
              ]}
            >
              {subject.name}
            </Text>
            <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
            {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
              <CardHeaderIn
                key={index}
                style={{ alignSelf: 'stretch' }}
                topText={checkPointTitle(checkPoint.theme, index + 1)}
              >
                <DoubleTextRow  first={'Оценка: '}             second={getCheckPointScore(checkPoint)} />
                <DoubleTextRow  first={'Проходной балл: '}     second={checkPoint.passScore} />
                <DoubleTextRow  first={'Текущий балл: '}       second={checkPoint.currentScore} />
                <DoubleTextRow  first={'Максимальный балл: '}  second={checkPoint.maxScore} />
                <TextRow        text={'Дата: ' + checkPoint.date} />
                <TextRow        text={'Вид работы: ' + checkPoint.typeWork} />
                <TextRow        text={'Вид контроля: ' + checkPoint.typeControl} />
                <TextRow        text={'Преподаватель: ' + checkPoint.teacher} />
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
