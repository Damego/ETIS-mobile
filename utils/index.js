import { downloadFile, saveFile, selectFile } from './files';
import httpClient from './http';
import Storage from './storage';
import { PRIVACY_POLICY_URL } from './consts';

const storage = new Storage();

export { httpClient, storage, downloadFile, saveFile, selectFile, PRIVACY_POLICY_URL };
