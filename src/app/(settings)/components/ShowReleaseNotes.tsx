import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

const ShowReleaseNotes = () => {
  const router = useRouter();
  const theme = useAppTheme();

  const onPress = () => {
    router.push('(releaseNotes)');
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
