import { load } from 'cheerio';

import { IDisciplineAbsences } from '../models/absences'
import { getTextField } from './utils';

export default function parseAbsences(html) {
  const $ = load(html);
  let data: IDisciplineAbsences[] = [];
  $('tr', html).each((index, element) => {
    if (index === 0) return;

    const td = $(element).find('td');
    const fields = [];
    for (let i = 0; i < 5; i += 1) {
      fields[i] = getTextField(td.eq(i));
    }
    const [number, time, subject, type, teacher] = fields;

    data.push({
      number: parseInt(number),
      time,
      subject,
      type,
      teacher,
    });
  });
  return data;
}
