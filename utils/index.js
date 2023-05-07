import HTTPClient from './http';
import Storage from './storage';
import DataParsing from './parser';

const httpClient = new HTTPClient();
const storage = new Storage()
const parser = new DataParsing()

export {
  httpClient,
  storage,
  parser,
}