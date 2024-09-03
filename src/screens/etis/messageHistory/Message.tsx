import React from 'react';
import { StyleSheet, View } from 'react-native';
import CardHeaderOut from '~/components/CardHeaderOut';
import FileTextLink from '~/components/FileTextLink';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { IMessage, IMessageFile, MessageType } from '~/models/messages';
import { parseDatetime } from '~/parser/utils';
import { fontSize } from '~/utils/texts';

const styles = StyleSheet.create({
  subjectText: {
    ...fontSize.medium,
    fontWeight: 'bold',
  },
});

const AttachedFiles = ({ files }: { files: IMessageFile[] }) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      <Text style={styles.subjectText}>Прикреплённые файлы: </Text>
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
  const time = parseDatetime(message.time);
  const formattedTime = time.format('DD.MM.YYYY HH:mm');
  const hasFiles = message.files && message.files.length !== 0;
  const theme = useAppTheme();

  let cardTopText: string;
  if ([MessageType.message, MessageType.teacherReply].includes(message.type))
    cardTopText = `Преподаватель`;
  else if (message.type === MessageType.studentReply) cardTopText = `Вы`;

  return (
    <CardHeaderOut topText={cardTopText}>
      <Text selectable selectionColor={theme.colors.primary}>
        {message.content}
      </Text>
      {hasFiles ? <AttachedFiles files={message.files} /> : ''}
      <View style={{ alignItems: 'flex-end' }}>
        <Text>{formattedTime}</Text>
      </View>
    </CardHeaderOut>
  );
}

export default Message;
