import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { RootStackNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';
import { useAppTheme } from '~/hooks/theme';

const ShowReleaseNotes = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  const onPress = () => {
    navigation.navigate('ReleaseNotes');
  };

  return (
    <Card>
      <ClickableText
        text={'Список изменений'}
        onPress={onPress}
        viewStyle={{ gap: 8 }}
        textStyle={fontSize.medium}
        iconLeft={<AntDesign name={'copy1'} size={26} color={theme.colors.text} />}
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

export default ShowReleaseNotes;
