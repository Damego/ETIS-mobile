import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Linking } from 'react-native';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { useAppTheme } from '~/hooks/theme';
import { TELEGRAM_URL } from '~/utils';
import { fontSize } from '~/utils/texts';

const TelegramAppChannel = () => {
  const theme = useAppTheme();

  return (
    <Card>
      <ClickableText
        text={'Наш телеграм канал'}
        onPress={() => Linking.openURL(TELEGRAM_URL)}
        textStyle={fontSize.medium}
        viewStyle={{ gap: 8 }}
        iconLeft={<FontAwesome name={'telegram'} size={26} color={theme.colors.text} />}
        iconRight={
          <AntDesign
            name={'right'}
            size={20}
            style={{ marginLeft: 'auto' }}
            color={theme.colors.text}
          />
        }
      />
    </Card>
  );
};

export default TelegramAppChannel;
