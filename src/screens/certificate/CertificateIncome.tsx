import * as MailComposer from 'expo-mail-composer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';

import Card from '../../components/Card';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { Input, PopoverElement } from './CertificateComponents';
import { Button } from '../../components/Button';
import { RootStackNavigationProp } from '../../navigation/types';
import { getStudentYear } from '../../utils/datetime';

const stipEmail = 'stip@psu.ru';

interface IMailModel {
  fio: string,
  faculty: string,
  year: string,
  certPeriod: string,
}

function composeMail(model: IMailModel) {
  let options: MailComposer.MailComposerOptions = {};
  options.recipients = [stipEmail];
  options.subject = 'Справка о доходах';
  options.body = `1. ФИО: ${model.fio}\n2. Факультет: ${model.faculty}, курс: ${model.year}\n3. Период в месяцах: ${model.certPeriod}`;
  return MailComposer.composeAsync(options);
}

export default function CertificateIncome() {
  const globalStyles = useGlobalStyles();
  const navigator = useNavigation<RootStackNavigationProp>();
  const { info } = useAppSelector((state) => state.student);
  const [fio, setFio] = useState<string>(info.name);
  const [faculty, setFaculty] = useState<string>();
  const [year, setYear] = useState<string>(getStudentYear(Number.parseInt(info.year)));
  const [certPeriod, setCertPeriod] = useState<string>();

  const applicable = fio && faculty && year && certPeriod;

  const confirmSubmit = () => {
    composeMail({
      fio,
      faculty,
      year,
      certPeriod
    }).then(result => {
      if (result.status == MailComposer.MailComposerStatus.SENT) navigator.goBack();
    });
  }

  return (
    <Screen>
      <View>
        <Text style={[globalStyles.fontColorForBlock, { fontSize: 16 }]} colorVariant={'block'}>
          Справки о доходах (стипендии) можно заказать по телефону 239-65-34 или по электронной
          почте stip@psu.ru, необходимо указать следующие данные:
        </Text>
        <Card style={{ marginTop: 10 }}>
          <Input
            name="ФИО"
            placeholder="Иванов Иван Иванович"
            value={fio}
            onUpdate={setFio}
            popover={<></>}
          />
          <Input
            name="Факультет"
            placeholder="Механико-математический"
            value={faculty}
            onUpdate={setFaculty}
            popover={<></>}
          />
          <Input name="Курс" placeholder="1" value={year} onUpdate={setYear} popover={<></>} />
          <Input
            name="Период (мес.)"
            placeholder="3"
            value={certPeriod}
            onUpdate={setCertPeriod}
            popover={
              <PopoverElement text="Период, за который нужна справка. Если нужна за последний год, укажите 12." />
            }
          />
        </Card>
        <Text style={[globalStyles.fontColorForBlock, { fontSize: 16 }]} colorVariant={'block'}>
          Срок изготовления справки - 3 рабочих дня. Студентам первого курса в сентябре месяце
          справки о доходах не выдаются.
        </Text>
      </View>
      {applicable && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: '1%' }}>
          <Button text={'Составить e-mail'} onPress={confirmSubmit} variant={'secondary'} />
        </View>
      )}
    </Screen>
  );
}

// лучше оставить на случай разработки под IOS
// function openMailClientIOS() {
//   Linking.canOpenURL('message:0')
//     .then((supported) => {
//       if (!supported) {
//         console.log('Cant handle url');
//       } else {
//         return Linking.openURL('message:0').catch(this.handleOpenMailClientErrors);
//       }
//     })
//     .catch(this.handleOpenMailClientErrors);
// }
