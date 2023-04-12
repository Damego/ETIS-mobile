import HTTPClient from './http';
import Storage from './storage';
import DataParsing from './parser';

export const vars = {
  httpClient: new HTTPClient(),
  storage: new Storage(),
  parser: new DataParsing(),
};
