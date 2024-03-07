import { FileSystemDownloadResult } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import React, { useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';

import {
  errorDownloadNotification,
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

const downloadedFiles: { [key: string]: string } = {};

const FileTextLink = ({
  src,
  fileName,
  style,
  children,
}: {
  src: string;
  fileName: string;
  style: StyleProp<TextStyle>;
  children: React.ReactNode;
}) => {
  const isDownloading = useRef(false);

  const downloadAndSave = async () => {
    // TODO:
    //  Необходимо реализовать некий менеджер загрузок, в котором можно увидеть все скачанные ранее файлы
    //  А также возможность открывать уже скачанный файл.
    if (isDownloading.current) return;

    if (downloadedFiles[fileName]) {
      openFile(downloadedFiles[fileName]);
      return;
    }

    ToastAndroid.show('Началось скачивание', ToastAndroid.LONG);
    const { id, channelId } = await startDownloadNotification(fileName);
    let fileData: FileSystemDownloadResult;

    try {
      isDownloading.current = true;
      fileData = await downloadFile(src, fileName);
    } catch {
      isDownloading.current = false;
      await errorDownloadNotification({ id, channelId, fileName });
      return;
    }

    isDownloading.current = false;
    downloadedFiles[fileName] = fileData.uri;
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
