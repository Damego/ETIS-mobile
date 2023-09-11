import { load } from 'cheerio';

import { IAbsenceDate, IDisciplineAbsences, IPeriodAbsences } from '../models/absences'
import { getTextField } from './utils';

const parseDate = (date: string): IAbsenceDate => {
  const $ = load(date);
  const parsed = $('font', date);
  return { date: parsed.text(), isCovered: parsed.attr('color') !== 'red'  }
};

export default function parseAbsences(html): IPeriodAbsences {
  const $ = load(html);
  let data: IDisciplineAbsences[] = [];
  $('tr', html).each((index, element) => {
    if (index === 0) return;

    const td = $(element).find('td');
    const fields = [];
    
    // we will skip the number as it's not important info
    for (let i = 1; i < 5; i += 1) {
      if (i == 1) { // for the dates
        fields[i - 1] = td.eq(i).html().trim().split('<br>');
        continue;
      }
      fields[i - 1] = getTextField(td.eq(i));
    }
    const [dates, subject, type, teacher] = fields;

    data.push({
      dates: dates.map(parseDate),
      subject,
      type,
      teacher,
    });
  });

  let period: number;
  let periods: string[] = [];
  $('span.submenu-item', html).each((index, element) => {
    let parsed = $(element);
    periods.push(parsed.text().trim());

    // define current period (current period's <a> doesn't have href attr)
    if (parsed.find('a.dashed').attr('href') === undefined)
      period = index + 1;
  });

  let overallMissed: string = $('div.span9', html).text().split(' ').at(-1);

  return { period: period, periods: periods, absences: data, overallMissed: parseInt(overallMissed) };
}
