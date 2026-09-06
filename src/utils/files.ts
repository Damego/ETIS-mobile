import { Directory, File, Paths } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';

import { IDisciplineInfo, IDisciplineTask } from '../models/disciplineInfo';
import httpClient from './http';

const downloadFile = (url: string, fileName: string) => httpClient.downloadFile(url, fileName);

/**
 * Сохраняет скачанный файл через системный выбор каталога (SAF).
 * Отмена выбора каталога бросает ошибку — вызывающий обязан поймать её.
 */
const saveFileFromCache = async (file: File, fileName: string) => {
  const directory = await Directory.pickDirectoryAsync();
  const target = directory.createFile(fileName, file.type || 'application/octet-stream');
  target.write(await file.base64(), { encoding: 'base64' });
};

// discipline_notes.json
const saveJSONToDocuments = async (data: unknown, fileName: string) => {
  new File(Paths.document, fileName).write(JSON.stringify(data));
};

const readJSONFromDocuments = async <T>(fileName: string, defaultValue: T): Promise<T> => {
  const file = new File(Paths.document, fileName);

  try {
    if (!file.exists) {
      await saveJSONToDocuments(defaultValue, fileName);
      return defaultValue;
    }

    const stringData = await file.text();
    if (!stringData || stringData.trim() === '') {
      await saveJSONToDocuments(defaultValue, fileName);
      return defaultValue;
    }
    return JSON.parse(stringData) as T;
  } catch {
    await saveJSONToDocuments(defaultValue, fileName);
    return defaultValue;
  }
};

const saveDisciplineInfo = (data: IDisciplineInfo[]) =>
  saveJSONToDocuments(data, 'discipline_info.json');
const readDisciplineInfo = (): Promise<IDisciplineInfo[]> =>
  readJSONFromDocuments('discipline_info.json', []);
const saveDisciplinesTasks = (data: IDisciplineTask[]) =>
  saveJSONToDocuments(data, 'disciplines_tasks.json');
const readDisciplinesTasks = (): Promise<IDisciplineTask[]> =>
  readJSONFromDocuments('disciplines_tasks.json', []);

const openFile = (uri: string) => {
  const { contentUri } = new File(uri);
  IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1,
  });
};

export {
  downloadFile,
  openFile,
  readDisciplineInfo,
  readDisciplinesTasks,
  readJSONFromDocuments,
  saveDisciplineInfo,
  saveDisciplinesTasks,
  saveFileFromCache,
  saveJSONToDocuments,
};
