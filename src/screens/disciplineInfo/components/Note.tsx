import React, { useEffect, useState } from 'react';
import { Text, TextInput, ToastAndroid } from 'react-native';

import BorderLine from '../../../components/BorderLine';
import ClickableText from '../../../components/ClickableText';
import { useGlobalStyles } from '../../../hooks';
import { IDisciplineInfo } from '../../../models/disciplineInfo';
import { DisciplineStorage } from '../../../models/disciplinesTasks';

const findDiscipline = (disciplineName: string, disciplines: IDisciplineInfo[]) => {
  let info = disciplines.find((info) => info.name === disciplineName);
  if (info) return info;
  info = { note: '', name: disciplineName };
  disciplines.push(info);
  return info;
};

export const Note = ({disciplineName}: {disciplineName: string}) => {
  const globalStyles = useGlobalStyles();
  const [info, setInfo] = useState<IDisciplineInfo>();
  const [isTextChanged, setTextChanged] = useState(false);

  useEffect(() => {
    DisciplineStorage.getInfo().then((disciplines) => {
      setInfo(findDiscipline(disciplineName, disciplines));
    });
  }, []);

  const handleEditNote = (value: string) => {
    setInfo((info) => ({ ...info, note: value }));
    setTextChanged(true);
  };

  const handleNoteSave = () => {
    DisciplineStorage.getInfo().then((infos) => {
      const $info = findDiscipline(disciplineName, infos);
      $info.note = info.note;
      DisciplineStorage.saveInfo().then(() => {
        ToastAndroid.show('Сохранено!', ToastAndroid.LONG);
        setTextChanged(false);
      });
    });
  };

  if (!info) return;

  return (
    <>
      <BorderLine />

      <Text style={{ fontSize: 20, fontWeight: '500' }}>Заметки</Text>
      <TextInput
        style={[globalStyles.border, { padding: '2%', fontSize: 16 }]}
        value={info.note}
        onChangeText={handleEditNote}
        placeholder={'Запишите сюда почту или телефон преподавателя'}
        multiline
      />

      {isTextChanged && <ClickableText text={'Сохранить'} onPress={handleNoteSave} />}
    </>
  );
};
