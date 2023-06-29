import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import FileTextLink from '../../components/FileTextLink';
import { useGlobalStyles } from '../../hooks';
import { IMessage, IMessageFile, MessageType } from '../../models/messages';
import { parseDate } from '../../parser/utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  subjectText: {
    ...fontSize.medium,
    fontWeight: 'bold',
  },
});

const AttachedFiles = ({ files }: { files: IMessageFile[] }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flexDirection: 'column' }}>
      <Text style={[styles.subjectText, globalStyles.textColor]}>Прикреплённые файлы: </Text>
      {files.map((file, index) => (
        <FileTextLink
          src={file.uri}
          fileName={file.name}
          key={`${file.name}-${index}`}
          style={fontSize.medium}
        >
          {file.name}
        </FileTextLink>
      ))}
    </View>
  );
};

function Message({ message }: { message: IMessage }) {
  const globalStyles = useGlobalStyles();

  const time = parseDate(message.time);
  const formattedTime = time.format('DD.MM.YYYY HH:mm');
  const hasFiles = message.files && message.files.length !== 0;

  let cardTopText;
  if ([MessageType.message, MessageType.teacherReply].includes(message.type))
    cardTopText = `Преподаватель`;
  else if (message.type === MessageType.studentReply) cardTopText = `Вы`;

  return (
    <CardHeaderOut topText={cardTopText}>
      <Text style={[styles.text, globalStyles.textColor]} selectable selectionColor={'#ade1f5'}>
        {message.content}
      </Text>
      {hasFiles ? <AttachedFiles files={message.files} /> : ''}
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={globalStyles.textColor}>{formattedTime}</Text>
      </View>
    </CardHeaderOut>
  );
}

export default Message;
