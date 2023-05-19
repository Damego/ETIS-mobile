import { downloadFile, saveFile, selectFile } from './files';
import httpClient from './http';
import Storage from './storage';

const storage = new Storage();

export { httpClient, storage, downloadFile, saveFile, selectFile };
