import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

const AboutAppButton = () => {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Card>
      <ClickableText
        text={'О приложении'}
        onPress={() => router.push('(about)')}
        textStyle={fontSize.medium}
        viewStyle={{ gap: 8 }}
        iconLeft={<AntDesign name={'infocirlceo'} size={26} color={theme.colors.text} />}
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

export default AboutAppButton;
