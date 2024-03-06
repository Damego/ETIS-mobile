import { shareAsync } from 'expo-sharing';
import React, { useRef } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import {
  finishDownloadNotification,
  startDownloadNotification,
} from '../notifications/fileDownload';
import { downloadFile, saveFileFromCache } from '../utils';
import { openFile } from '../utils/files';

const defaultStyle = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#427ADE',
  },
});

const FileTextLink = ({ src, fileName, style, children }) => {
  const uri = useRef(null);

  const downloadAndSave = async () => {
    if (uri.current) {
      openFile(uri.current);
      return;
    }
    const { id, channelId } = await startDownloadNotification(fileName);
    const fileData = await downloadFile(src, fileName);
    uri.current = fileData.uri;
    await finishDownloadNotification({ id, channelId, fileName, fileUri: fileData.uri });

    try {
      await saveFileFromCache(fileData, fileName);
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
