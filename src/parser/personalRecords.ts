import * as cheerio from 'cheerio';

import { IPersonalRecord } from '../models/personalRecords';
import { getTextField } from './utils';

const parsePersonalRecords = (html: string): IPersonalRecord[] => {
  const $ = cheerio.load(html);

  const data: IPersonalRecord[] = [];

  const table = $('.common');
  table.find('tr').each((index, trElement) => {
    if (index === 0) return;

    const tr = $(trElement);
    const td = tr.find('td');
    const fields = [];
    for (let i = 0; i < 5; i += 1) {
      fields.push(getTextField(td.eq(i)));
    }

    let recordID: string;
    const recordElement = td.eq(5).find('a');
    if (recordElement.length === 1) {
      recordID = recordElement.attr('href').split('=').at(1);
    }

    const [year, speciality, faculty, educationForm, status] = fields;
    data.push({
      id: recordID,
      index: index - 1,
      year,
      speciality,
      faculty,
      educationForm,
      status,
    });
  });
  return data;
};

export default parsePersonalRecords;
