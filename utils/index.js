import { downloadFile, saveFile, uploadFile } from './files';
import httpClient from './http';
import DataParsing from './parser';
import Storage from './storage';

const storage = new Storage();
const parser = new DataParsing();

export { httpClient, storage, parser, downloadFile, saveFile, uploadFile };
