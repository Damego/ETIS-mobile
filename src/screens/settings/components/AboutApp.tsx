import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { ServicesNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

const AboutAppButton = () => {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <Card>
      <ClickableText
        text={'О приложении'}
        onPress={() => navigation.navigate('AboutApp')}
        textStyle={fontSize.medium}
        viewStyle={{ gap: 8 }}
        iconLeft={<AntDesign name={'infocirlceo'} size={26} />}
        iconRight={<AntDesign name={'right'} size={20} style={{ marginLeft: 'auto' }} />}
      />
    </Card>
  );
};

export default AboutAppButton;
