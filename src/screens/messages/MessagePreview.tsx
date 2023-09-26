import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import { useGlobalStyles } from '../../hooks';
import { IMessage } from '../../models/messages';
import { parseDate } from '../../parser/utils';
import { fontSize } from '../../utils/texts';
import { BottomTabsNavigationProp } from '../../navigation/types';

const styles = StyleSheet.create({
  textBold: {
    fontWeight: '600',
  },
});

const MessagePreview = ({ data, page }: { data: IMessage[]; page: number }) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<BottomTabsNavigationProp>();
  const [mainMessage] = data;
  const { author, subject, theme } = mainMessage;
  const time = parseDate(mainMessage.time);

  return (
    <CardHeaderOut topText={author}>
      <TouchableOpacity onPress={() => navigation.navigate('History', { data, page })}>
        <Text style={[styles.textBold, fontSize.medium, globalStyles.textColor]}>{subject}</Text>
        <Text style={globalStyles.textColor}>{theme}</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={globalStyles.textColor}>{time.format('DD.MM.YYYY HH:mm')}</Text>
        </View>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default MessagePreview;
