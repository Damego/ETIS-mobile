import {
  EncodingType,
  StorageAccessFramework,
  documentDirectory,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system';

import { IDisciplineInfo, IDisciplineTask } from '../models/disciplineInfo';
import httpClient from './http';

const downloadFile = (url, fileName) => httpClient.downloadFile(url, fileName);

const saveFileFromCache = async (fileData, fileName) => {
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
};

// discipline_notes.json
const saveJSONToDocuments = async (data: any, fileName: string) => {
  await writeAsStringAsync(`${documentDirectory}${fileName}`, JSON.stringify(data));
};

const readJSONFromDocuments = async (fileName: string, defaultValue: any) => {
  let stringData: string;

  try {
    stringData = await readAsStringAsync(`${documentDirectory}${fileName}`);
  } catch (e) {
    await saveJSONToDocuments(defaultValue, fileName);
    stringData = await readAsStringAsync(`${documentDirectory}${fileName}`);
  }
  return JSON.parse(stringData);
};

const saveDisciplineInfo = (data: IDisciplineInfo[]) =>
  saveJSONToDocuments(data, 'discipline_info.json');
const readDisciplineInfo = (): Promise<IDisciplineInfo[]> =>
  readJSONFromDocuments('discipline_info.json', []);

const saveDisciplinesTasks = (data: IDisciplineTask[]) =>
  saveJSONToDocuments(data, 'disciplines_tasks.json');
const readDisciplinesTasks = (): Promise<IDisciplineTask[]> =>
  readJSONFromDocuments('disciplines_tasks.json', []);

export {
  downloadFile,
  saveFileFromCache,
  saveJSONToDocuments,
  readJSONFromDocuments,
  saveDisciplineInfo,
  readDisciplineInfo,
  saveDisciplinesTasks,
  readDisciplinesTasks,
};
