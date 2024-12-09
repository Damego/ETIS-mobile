import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OptionButton from '~/app/(start)/components/OptionButton';
import { Button } from '~/components/Button';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { AccountType, setAccountState } from '~/redux/reducers/accountSlice';
import { fontSize } from '~/utils/texts';
import { useRouter } from 'expo-router';

const WarningMessage = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View
      style={[
        globalStyles.card,
        { padding: '2%', flexDirection: 'row', gap: 8 },
        globalStyles.borderRadius,
      ]}
    >
      <AntDesign name="warning" size={24} color={globalStyles.primaryText.color} />
      <Text style={[globalStyles.primaryText, { fontWeight: 'bold', flex: 1 }, fontSize.medium]}>
        Расписание может отличаться от действительного!{'\n'}Особенно, если у вас в текущем учебном
        периоде имеются дисциплины по выбору!
      </Text>
    </View>
  );
};

const SelectStudentAccountTypeScreen = () => {
  const router = useRouter();
  const [withAuth, setWithAuth] = useState<boolean>(true);

  const handleSelect = ($withAuth: boolean) => () => {
    setWithAuth($withAuth);
  };

  const handleChoose = () => {
    if (withAuth) {
      router.push("/auth")
    } else {
      // navigation.navigate('SelectFaculty');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <OptionButton
          isPressed={withAuth}
          onPress={handleSelect(true)}
          bottomComponent={<Text>Расписание, оценки, сообщения{'\n'}и многое другое!</Text>}
        >
          С авторизацией в ЕТИС
        </OptionButton>
        <OptionButton
          isPressed={!withAuth}
          onPress={handleSelect(false)}
          bottomComponent={<Text>Доступно только расписание</Text>}
        >
          Без авторизации в ЕТИС
        </OptionButton>
      </View>

      {!withAuth && <WarningMessage />}

      <View style={styles.buttonWrapper}>
        <Button text={'Выбрать'} onPress={handleChoose} variant={'primary'} />
      </View>
    </View>
  );
};

export default SelectStudentAccountTypeScreen;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    gap: 16,
    marginTop: '20%',
  },
  screenContainer: {
    marginHorizontal: '4%',
    flex: 1,
    gap: 16,
  },
  button: {
    position: 'absolute',
    bottom: '2%',
    left: 0,
    right: 0,
    padding: '4%',
    alignItems: 'center',
  },
  buttonWrapper: {
    marginTop: 'auto',
    marginBottom: '2%',
  },
});
