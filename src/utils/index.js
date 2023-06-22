import { GITHUB_URL, NOTIFICATION_GUIDE_URL, PRIVACY_POLICY_URL, TELEGRAM_URL } from './consts';
import { downloadFile, saveFile, selectFile } from './files';
import httpClient from './http';
import Storage from './storage';

const storage = new Storage();

export {
  httpClient,
  storage,
  downloadFile,
  saveFile,
  selectFile,
  PRIVACY_POLICY_URL,
  NOTIFICATION_GUIDE_URL,
  TELEGRAM_URL,
  GITHUB_URL,
};
