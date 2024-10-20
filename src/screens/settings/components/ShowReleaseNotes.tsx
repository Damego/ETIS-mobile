import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { RootStackNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

const ShowReleaseNotes = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

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
        iconLeft={<AntDesign name={'copy1'} size={26} />}
        iconRight={<AntDesign name={'right'} size={20} style={{ marginLeft: 'auto' }} />}
      />
    </Card>
  );
};

export default ShowReleaseNotes;
