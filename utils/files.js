import {
  EncodingType,
  StorageAccessFramework,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

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

export { downloadFile, saveFile };
