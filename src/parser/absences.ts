import { load } from 'cheerio';

import { IDisciplineAbsences, IPeriodAbsences } from '../models/absences'
import { getTextField } from './utils';

export default function parseAbsences(html): IPeriodAbsences {
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

  let period: number;
  let periods: number = 0;
  $('.submenu-item', html).each((index, element) => {
    if (index === 0) return;

    periods++;

    // define current period (current period doesn't have href attr)
    if ($(element).attr('href') === 'undefined')
      period = index + 1;
  });

  let overallMissed: string = $('div.span9', html).text().split(' ').at(-1);

  return { period: period, absences: data, overallMissed: parseInt(overallMissed) };
}
