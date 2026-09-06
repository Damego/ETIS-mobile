import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
}) => ({
  recipients: [stipEmail],
  subject: 'Справка о доходах',
  body: `1. ФИО: ${fio}\n2. Факультет: ${faculty}, курс: ${year}\n3. Период в месяцах: ${certPeriod}`,
});

export default function CertificateIncome() {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const client = useClient();

  const { info } = useAppSelector((state) => state.student);
  const [fio, setFio] = useState<string>(info?.name ?? '');
  const [faculty, setFaculty] = useState<string>('');
  const [year, setYear] = useState<string>(String(getStudentYear(Number.parseInt(info?.year ?? '1'))));
  const [certPeriod, setCertPeriod] = useState<string>('');
  useQuery({
    method: client.getPersonalRecords,
    payload: {
      requestType: RequestType.tryCache,
    },
    after: (result) => {
      const record = result.data?.find((item) => item.isCurrent);
      if (record?.faculty) setFaculty(record.faculty);
    },
  });

  const isApplicable: boolean = Boolean(fio) && Boolean(faculty) && Boolean(year) && Boolean(certPeriod);

  return (
    <Screen>
      <View>
        <Text style={[globalStyles.textColor, fontSize.medium]}>
          {t('certificate.income.instructions')}
        </Text>
        <Card style={{ marginTop: 10 }}>
          <Input
            name={t('certificate.income.fio')}
            placeholder={t('certificate.income.fioPlaceholder')}
            value={fio}
            popover={<></>}
            onUpdate={setFio}
          />
          <Input
            name={t('certificate.income.faculty')}
            placeholder={t('certificate.income.facultyPlaceholder')}
            value={faculty}
            popover={<></>}
            onUpdate={setFaculty}
          />
          <Input name={t('certificate.income.year')} placeholder='1' value={year} popover={<></>} onUpdate={setYear} />
          <Input
            name={t('certificate.income.period')}
            placeholder='3'
            value={certPeriod}
            popover={<PopoverElement text={t('certificate.income.periodPopover')} />}
            onUpdate={setCertPeriod}
          />
        </Card>
        <Text style={[globalStyles.textColor, fontSize.medium]}>
          {t('certificate.income.timingInfo')}
        </Text>
      </View>
      <View style={isApplicable ? styles.btnCompose : styles.btnComposeDisabled}>
        <Button
          text={t('certificate.income.composeMail')}
          variant={'primary'}
          disabled={!isApplicable}
          onPress={() =>
            composeMail(
              makeMailOptions({
                fio: fio ?? '',
                faculty: faculty ?? '',
                year: year ?? '',
                certPeriod: certPeriod ?? '',
              })
            )}
        />
      </View>
    </Screen>
  );
}

const btnCompose: ViewStyle = {
  position: 'absolute', left: 0, right: 0, bottom: '1%'
};
const styles = StyleSheet.create({
  btnCompose,
  btnComposeDisabled: {
    ...btnCompose,
    opacity: 0.75,
  },
});
