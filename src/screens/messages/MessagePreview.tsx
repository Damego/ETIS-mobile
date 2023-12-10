import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import Text from '../../components/Text';
import { useGlobalStyles } from '../../hooks';
import { IMessage } from '../../models/messages';
import { BottomTabsNavigationProp } from '../../navigation/types';
import { parseDate } from '../../parser/utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  textBold: {
    fontWeight: '600',
    ...fontSize.medium,
  },
});

const MessagePreview = ({ data, page }: { data: IMessage[]; page: number }) => {
  const navigation = useNavigation<BottomTabsNavigationProp>();
  const [mainMessage] = data;
  const { author, subject, theme } = mainMessage;
  const time = parseDate(mainMessage.time);

  return (
    <CardHeaderOut topText={author}>
      <TouchableOpacity onPress={() => navigation.navigate('History', { data, page })}>
        <Text style={styles.textBold} colorVariant={'block'}>
          {subject}
        </Text>
        <Text colorVariant={'block'}>{theme}</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text colorVariant={'block'}>{time.format('DD.MM.YYYY HH:mm')}</Text>
        </View>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default MessagePreview;
