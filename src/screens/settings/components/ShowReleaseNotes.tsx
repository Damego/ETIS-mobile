import { useNavigation } from '@react-navigation/native';
import React from 'react';

import Card from '../../../components/Card';
import ClickableText from '../../../components/ClickableText';
import { RootStackNavigationProp } from '../../../navigation/types';
import { fontSize } from '../../../utils/texts';

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
        textStyle={[fontSize.medium, { fontWeight: '500' }]}
      />
    </Card>
  );
};

export default ShowReleaseNotes;
