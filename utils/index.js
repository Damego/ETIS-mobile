import { PRIVACY_POLICY_URL } from './consts';
import HTTPClient from './http';
import DataParsing from './parser';
import Storage from './storage';

const httpClient = new HTTPClient();
const storage = new Storage();
const parser = new DataParsing();

export { httpClient, storage, parser, PRIVACY_POLICY_URL };
