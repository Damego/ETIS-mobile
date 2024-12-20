import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button } from '~/components/Button';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { PopoverElement } from '~/screens/etis/certificate/components/PopoverElement';
import { getStudentYear } from '~/utils/datetime';
import composeMail from '~/utils/email';
import { fontSize } from '~/utils/texts';

import Input from './components/Input';

const stipEmail = 'stip@psu.ru';

const makeMailOptions = ({
  fio,
  faculty,
  year,
  certPeriod,
}: {
  fio: string;
  faculty: string;
  year: string;
  certPeriod: string;
}) => {
  return {
    recipients: [stipEmail],
    subject: 'Справка о доходах',
    body: `1. ФИО: ${fio}\n2. Факультет: ${faculty}, курс: ${year}\n3. Период в месяцах: ${certPeriod}`,
  };
};

export default function CertificateIncome() {
  const globalStyles = useGlobalStyles();
  const client = useClient();

  const { info } = useAppSelector((state) => state.student);
  const [fio, setFio] = useState<string>(info.name);
  const [faculty, setFaculty] = useState<string>();
  const [year, setYear] = useState<string>(getStudentYear(Number.parseInt(info.year)));
  const [certPeriod, setCertPeriod] = useState<string>();
  useQuery({
    method: client.getPersonalRecords,
    payload: {
      requestType: RequestType.tryCache,
    },
    after: (result) => {
      setFaculty(result.data.find((record) => record.isCurrent).faculty);
    },
  });

  const isApplicable: boolean = !!fio && !!faculty && !!year && !!certPeriod;

  return (
    <Screen>
      <View>
        <Text style={[globalStyles.textColor, fontSize.medium]}>
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
        <Text style={[globalStyles.textColor, fontSize.medium]}>
          Срок изготовления справки - 3 рабочих дня. Справки выдаются только за прошедшие месяцы -
          студентам первого курса в сентябре месяце справки о доходах не выдаются. {'\n\n'}
          Получение справки - в отделе расчёта с обучающимися, 1 корпус, 322 кабинет.
        </Text>
      </View>
      <View style={isApplicable ? styles.btnCompose : styles.btnComposeDisabled}>
        <Button
          text={'Составить письмо'}
          onPress={() =>
            composeMail(
              makeMailOptions({
                fio,
                faculty,
                year,
                certPeriod,
              })
            )
          }
          variant={'primary'}
          disabled={!isApplicable}
        />
      </View>
    </Screen>
  );
}

const btnCompose: ViewStyle = { position: 'absolute', left: 0, right: 0, bottom: '1%' };
const styles = StyleSheet.create({
  btnCompose,
  btnComposeDisabled: {
    ...btnCompose,
    opacity: 0.75,
  },
});
