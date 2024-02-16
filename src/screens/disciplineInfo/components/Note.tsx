import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

import BorderLine from '../../../components/BorderLine';
import Text from '../../../components/Text';
import { useGlobalStyles } from '../../../hooks';
import { IDisciplineInfo } from '../../../models/disciplineInfo';
import { DisciplineStorage } from '../../../models/disciplinesTasks';
import { fontSize } from '../../../utils/texts';

const findDiscipline = (disciplineName: string, disciplines: IDisciplineInfo[]) => {
  let info = disciplines.find((info) => info.name === disciplineName);
  if (info) return info;
  info = { note: '', name: disciplineName };
  disciplines.push(info);
  return info;
};

const Note = ({ disciplineName }: { disciplineName: string }) => {
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

      <Text style={styles.text}>Заметки</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={[globalStyles.border, styles.textInput, globalStyles.fontColorForBlock]}
          value={info.note}
          onChangeText={handleEditNote}
          placeholder={'Запишите сюда почту или телефон преподавателя'}
          multiline
        />

        {isTextChanged && (
          <TouchableOpacity style={styles.saveIcon} onPress={handleNoteSave}>
            <Ionicons name={'save-outline'} size={26} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default Note;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
  },
  textInput: {
    padding: '2%',
    paddingRight: '10%',
    ...fontSize.medium,
  },
  text: {
    fontWeight: '500',
    ...fontSize.large,
  },
  saveIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: '1%',
    marginBottom: '2%',
  },
});
