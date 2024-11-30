import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

const ChangeAppUI = () => {
  const theme = useAppTheme();

  const onPress = () => {
    // navigation.navigate('ChangeAppUI');
  };

  return (
    <Card>
      <ClickableText
        text={'Настройки интерфейса'}
        onPress={onPress}
        viewStyle={{ gap: 8 }}
        textStyle={fontSize.medium}
        iconRight={
          <AntDesign
            name={'right'}
            size={20}
            style={{ marginLeft: 'auto' }}
            color={theme.colors.text}
          />
        }
        iconLeft={<AntDesign name={'picture'} size={26} color={theme.colors.text} />}
      />
    </Card>
  );
};

export default ChangeAppUI;
