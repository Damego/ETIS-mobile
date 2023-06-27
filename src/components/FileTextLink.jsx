import * as Notifications from 'expo-notifications';
import { shareAsync } from 'expo-sharing';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { downloadFile, saveFile } from '../utils';
import { getPointsWord } from '../utils/texts';

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
      console.log(e);
      console.trace();
    }
    await shareAsync(fileData.uri);
  };

  return (
    <TouchableOpacity onPress={downloadAndSave}>
      <Text style={[defaultStyle.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default FileTextLink;
