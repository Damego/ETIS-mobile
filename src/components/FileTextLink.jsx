import * as Notifications from 'expo-notifications';
import { shareAsync } from 'expo-sharing';
import React from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import { downloadFile, saveFile } from '../utils';

const defaultStyle = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#427ADE',
  },
});

const FileTextLink = ({ src, fileName, style, children }) => {
  const downloadAndSave = async () => {
    const fileData = await downloadFile(src, fileName);

    try {
      await saveFile(fileData, fileName);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Файл скачан',
          body: `Успешно загружен файл ${fileName}`,
        },
        trigger: null,
      });
    } catch (e) {
      ToastAndroid.show('Невозможно скачать файл в указанную папку', ToastAndroid.SHORT);
      console.log(e);
    }
    shareAsync(fileData.uri).catch((e) => e);
  };

  return (
    <TouchableOpacity onPress={downloadAndSave}>
      <Text style={[defaultStyle.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default FileTextLink;
