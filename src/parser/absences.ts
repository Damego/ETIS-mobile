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
    
    // we will skip the number as it's not important info
    for (let i = 1; i < 5; i += 1) {
      if (i = 1) { // for the times
        fields[i - 1] = td.eq(i).html().trim().split('<br>');
        continue;
      }
      fields[i - 1] = getTextField(td.eq(i));
    }
    const [time, subject, type, teacher] = fields;

    data.push({
      dates: time,
      subject,
      type,
      teacher,
    });
  });

  let period: number;
  let periods: string[] = [];
  $('span.submenu-item', html).each((index, element) => {
    let parsed = $(element);
    periods.push(parsed.text());

    // define current period (current period's <a> doesn't have href attr)
    if (parsed.find('a.dashed').attr('href') === undefined)
      period = index + 1;
  });

  let overallMissed: string = $('div.span9', html).text().split(' ').at(-1);

  return { period: period, periods: periods, absences: data, overallMissed: parseInt(overallMissed) };
}
