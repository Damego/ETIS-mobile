import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { IMessage } from '~/models/messages';
import { EducationNavigationProp } from '~/navigation/types';
import { parseDate } from '~/parser/utils';
import { fontSize } from '~/utils/texts';

const MessageCard = ({ data, page }: { data: IMessage[]; page: number }) => {
  const navigation = useNavigation<EducationNavigationProp>();
  const [mainMessage] = data;
  const { author, subject, theme } = mainMessage;
  const time = parseDate(mainMessage.time);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('MessageHistory', { data, page })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.textBold}>{author}</Text>
        <Text>{time.format('DD MMMM')}</Text>
      </View>
      <Text style={fontSize.medium}>{subject}</Text>
      {!!theme && <Text colorVariant={'text2'}>{theme}</Text>}
    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  textBold: {
    fontWeight: '600',
    ...fontSize.medium,
  },
});
