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
  if (data.type === 'message') cardTopText = `${data.time}\n${data.author}`;
  else if (data.type === 'teacher_reply') cardTopText = `${data.time}\nОтвет`;
  else if (data.type === 'student_reply') cardTopText = `${data.time}\nВы`;

  return (
    <CardHeaderOut topText={cardTopText}>
      <View style={styles.view}>
        {data.type === 'message' ? <Text style={styles.subjectText}>{data.subject}</Text> : ''}
        <Text style={styles.text}>{data.content}</Text>
      </View>
    </CardHeaderOut>
  );
}

export default function MessageBlock({ data }) {
  return (
    <>
      {data.map((message) => (
        <Message data={message} key={message.time} />
      ))}
    </>
  );
}
