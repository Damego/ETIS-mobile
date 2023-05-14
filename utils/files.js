import {
  EncodingType,
  StorageAccessFramework,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import {getDocumentAsync} from 'expo-document-picker';
import {PermissionsAndroid} from 'react-native';

import httpClient from './http';

const downloadFile = (url, fileName) => httpClient.downloadFile(url, fileName);

const saveFile = async (fileData, fileName) => {
  const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (permissions.granted) {
    const base64 = await readAsStringAsync(fileData.uri, { encoding: EncodingType.Base64 });
    const newFileUrl = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      fileName,
      fileData.headers['Content-Type']
    );
    await writeAsStringAsync(newFileUrl, base64, { encoding: EncodingType.Base64 });
  }
  await shareAsync(fileData.uri);
};

const checkReadStoragePermission = () => {
  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
}

const requestReadStoragePermission = async () => {
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
  return granted === PermissionsAndroid.RESULTS.GRANTED;

}

const selectFile = async () => {
  const hasPerms = await checkReadStoragePermission()
  if (!hasPerms) {
    const result = await requestReadStoragePermission();
    if (!result) return;
  }

  const documentResult = await getDocumentAsync();
  if (documentResult.type === 'cancel') return;
  return documentResult
}

export { downloadFile, saveFile, selectFile };
