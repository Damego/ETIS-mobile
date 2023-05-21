import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import FileTextLink from '../../components/FileTextLink';

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

const AttachedFiles = ({ files }) => (
  <View style={{ flexDirection: 'column' }}>
    <Text style={styles.subjectText}>Прикреплённые файлы: </Text>
    {files.map((file, index) => (
      <FileTextLink
        src={file.uri}
        fileName={file.fileName}
        key={`${file.fileName}-${index}`}
        style={styles.text}
      >
        {file.fileName}
      </FileTextLink>
    ))}
  </View>
);

function Message({ data: { type, time, content, files } }) {
  let cardTopText;
  const formattedTime = time.format('DD.MM.YYYY HH:mm');
  if (['message', 'teacher_reply'].includes(type)) cardTopText = `Преподаватель (${formattedTime})`;
  else if (type === 'student_reply') cardTopText = `Вы (${formattedTime})`;

  return (
    <CardHeaderOut topText={cardTopText}>
      <View style={styles.view}>
        <Text style={styles.text} selectable selectionColor={'#ade1f5'}>
          {content}
        </Text>
        {files && files.length !== 0 ? <AttachedFiles files={files} /> : ''}
      </View>
    </CardHeaderOut>
  );
}

export default Message;