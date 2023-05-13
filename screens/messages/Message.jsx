import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';

const styles = StyleSheet.create({
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  view: {
    margin: '2%',
  },
  text: {
    fontSize: 16,
  },
});

function Message({ data }) {
  let cardTopText;
  const time = data.time.format('DD.MM.YYYY HH:mm');
  if (['message', 'teacher_reply'].includes(data.type)) cardTopText = `Преподаватель (${time})`;
  else if (data.type === 'student_reply') cardTopText = `Вы (${time})`;

  return (
    <CardHeaderOut topText={cardTopText}>
      <View style={styles.view}>
        {data.type === 'message' ? <Text style={styles.subjectText}>{data.subject}</Text> : ''}
        <Text style={styles.text} selectable selectionColor={'#ade1f5'}>
          {data.content}
        </Text>
      </View>
    </CardHeaderOut>
  );
}

export default Message;
