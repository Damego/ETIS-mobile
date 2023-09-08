import { useNavigation } from '@react-navigation/native';

import ClickableText from '../../components/ClickableText';
import { fontSize } from '../../utils/texts';
import { useGlobalStyles } from '../../hooks';

export default function ChangePersonalRecord() {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();

  return (
    <ClickableText
      text={'Сменить личную запись'}
      onPress={() => navigation.navigate('PersonalRecords')}
      textStyle={[fontSize.medium, { fontWeight: '500' }, globalStyles.textColor]}
    />
  );
}
