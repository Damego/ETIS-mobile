import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles, usePsutechHealth } from '~/hooks';
import { StartStackScreenProps } from '~/navigation/types';
import { AccountType, setAccountState } from '~/redux/reducers/accountSlice';
import OptionButton from '~/screens/start/components/OptionButton';
import { fontSize } from '~/utils/texts';

const WarningMessage = () => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <View
      style={[
        globalStyles.card,
        { padding: '2%', flexDirection: 'row', gap: 8 },
        globalStyles.borderRadius,
      ]}
    >
      <AntDesign name='warning' size={24} color={globalStyles.primaryText.color} />
      <Text style={[globalStyles.primaryText, { fontWeight: 'bold', flex: 1 }, fontSize.medium]}>
        {t('start.timetableMayDiffer')}
      </Text>
    </View>
  );
};

const SelectStudentAccountTypeScreen = ({ navigation }: StartStackScreenProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isDown: psutechDown } = usePsutechHealth();
  const [withAuth, setWithAuth] = useState<boolean>(true);
  const noAuthDisabled = psutechDown === true;

  const handleSelect = ($withAuth: boolean) => () => {
    if (!$withAuth && noAuthDisabled) return;
    setWithAuth($withAuth);
  };

  const handleChoose = () => {
    if (withAuth) {
      dispatch(setAccountState(AccountType.AUTHORIZED_STUDENT));
    } else if (!noAuthDisabled) {
      navigation.navigate('SelectFaculty');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View style={styles.screenContainer}>
        <View style={styles.container}>
          <OptionButton
            isPressed={withAuth}
            onPress={handleSelect(true)}
            bottomComponent={<Text>{t('start.fullAccessFeatures')}</Text>}
          >
            {t('start.withEtisAuth')}
          </OptionButton>
          <OptionButton
            isPressed={!withAuth}
            onPress={handleSelect(false)}
            disabled={noAuthDisabled}
            bottomComponent={
              <Text colorVariant={noAuthDisabled ? 'text2' : undefined}>
                {noAuthDisabled ? t('start.scheduleServiceUnavailable') : t('start.scheduleOnly')}
              </Text>
            }
          >
            {t('start.withoutEtisAuth')}
          </OptionButton>
        </View>

        {!withAuth && <WarningMessage />}

        <View style={styles.buttonWrapper}>
          <Button text={t('start.choose')} onPress={handleChoose} variant={'primary'} />
        </View>
      </View>
    </SafeAreaView>
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
