import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { fontSize } from '~/utils/texts';

const DropdownText = ({ title, value }: { title: string; value: string }) => {
  const [isOpened, setOpened] = React.useState(false);

  return (
    <View>
      <ClickableText
        textStyle={[fontSize.medium, { fontWeight: 'bold' }]}
        onPress={() => setOpened((prev) => !prev)}
        iconRight={<AntDesign name={isOpened ? 'up' : 'down'} size={18} />}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        {title}
      </ClickableText>
      {isOpened && <Text>{value}</Text>}
    </View>
  );
};

export default DropdownText;
