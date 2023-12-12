import React from 'react';
import { StyleSheet, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import FileTextLink from '../../components/FileTextLink';
import Text from '../../components/Text';
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
  return (
    <View style={{ flexDirection: 'column' }}>
      <Text style={styles.subjectText} colorVariant={'block'}>
        Прикреплённые файлы:{' '}
      </Text>
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
  const time = parseDate(message.time);
  const formattedTime = time.format('DD.MM.YYYY HH:mm');
  const hasFiles = message.files && message.files.length !== 0;

  let cardTopText: string;
  if ([MessageType.message, MessageType.teacherReply].includes(message.type))
    cardTopText = `Преподаватель`;
  else if (message.type === MessageType.studentReply) cardTopText = `Вы`;

  return (
    <CardHeaderOut topText={cardTopText}>
      <Text colorVariant={'block'} selectable selectionColor={'#ade1f5'}>
        {message.content}
      </Text>
      {hasFiles ? <AttachedFiles files={message.files} /> : ''}
      <View style={{ alignItems: 'flex-end' }}>
        <Text colorVariant={'block'}>{formattedTime}</Text>
      </View>
    </CardHeaderOut>
  );
}

export default Message;
