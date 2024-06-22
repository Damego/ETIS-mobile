import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import useBackPress from '~/hooks/useBackPress';
import { IDisciplineInfo } from '~/models/disciplineInfo';
import { DisciplineStorage } from '~/models/disciplinesTasks';
import { RootStackNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

const findDiscipline = (disciplineName: string, disciplines: IDisciplineInfo[]) => {
  let info = disciplines.find((info) => info.name === disciplineName);
  if (info) return info;
  info = { note: '', name: disciplineName };
  disciplines.push(info);
  return info;
};

const Note = ({ disciplineName }: { disciplineName: string }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const globalStyles = useGlobalStyles();
  const [info, setInfo] = useState<IDisciplineInfo>();
  const [isTextChanged, setTextChanged] = useState(false);
  const [showNote, setShowNote] = useState(true);

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

  useBackPress(() => {
    if (!isTextChanged) return false;
    Alert.alert(
      'Заметка',
      'У вас есть несохранённые изменения в заметке. Желаете ли вы сохранить?',
      [
        {
          text: 'Выйти',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Сохранить и выйти',
          onPress: () => {
            handleNoteSave();
            navigation.goBack();
          },
        },
      ]
    );
    return true;
  });

  if (!info) return;

  return (
    <>
      <BorderLine />

      <View style={styles.noteContainer}>
        <Text style={styles.text}>Заметки</Text>
        <TouchableOpacity onPress={() => setShowNote((prev) => !prev)}>
          <Ionicons
            name={showNote ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={24}
            color={globalStyles.textColor2.color}
          />
        </TouchableOpacity>
      </View>
      {showNote && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={[globalStyles.border, styles.textInput, globalStyles.textColor2]}
            value={info.note}
            onChangeText={handleEditNote}
            placeholder={'Запишите сюда почту или телефон преподавателя'}
            placeholderTextColor={globalStyles.inputPlaceholder.color}
            multiline
          />

          {isTextChanged && (
            <TouchableOpacity style={styles.saveIcon} onPress={handleNoteSave}>
              <Ionicons name={'save-outline'} size={26} color={globalStyles.textColor2.color} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

export default Note;

const styles = StyleSheet.create({
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
