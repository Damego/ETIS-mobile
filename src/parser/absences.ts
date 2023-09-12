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

  $('tr').each((index, element) => {
    if (index === 0) return;

    const td = $('td', element);
    const fields = [];

    // We will skip the number as it's not important info
    // The dates
    fields.push(td.eq(1).html().trim().split('<br>'));
    
    for (let i = 2; i < 5; i += 1) 
      fields.push(getTextField(td.eq(i)));

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

  $('span.submenu-item').each((index, element) => {
    let parsed = $(element);
    periods.push(parsed.text().trim());

    // define current period (current period's <a> doesn't have href attr)
    if (!parsed.find('a.dashed').attr('href'))
      period = index + 1;
  });

  let overallMissed: string = $('div.span9').text().split(' ').at(-1);

  return { period, periods, absences: data, overallMissed: parseInt(overallMissed) };
}
