import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/Button';
import Text from '~/components/Text';
import { useAppDispatch } from '~/hooks';
import { AccountType, setAccountState } from '~/redux/reducers/accountSlice';
import OptionButton from '~/screens/start/components/OptionButton';

const SelectStudentAccountTypeScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [withAuth, setWithAuth] = useState<boolean>(true);

  const handleSelect = ($withAuth: boolean) => () => {
    setWithAuth($withAuth);
  };

  const handleChoose = () => {
    if (withAuth) {
      dispatch(setAccountState(AccountType.AUTHORIZED_STUDENT));
    } else {
      navigation.navigate('SelectFaculty');
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
