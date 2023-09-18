import { load } from 'cheerio';

import { IAbsenceDate, IAbsenceSession, IAbsence, IDisciplineAbsences } from '../models/absences';
import { getTextField } from './utils';

export default function parseAbsences(html: string): IAbsence {
  const $ = load(html);
  const absences: IDisciplineAbsences[] = [];

  $('tr').each((index, element) => {
    if (index === 0) return;

    const td = $('td', element);
    const fields = [];

    // We will skip the number as it's not important info
    const dates: IAbsenceDate[] = [];
    td.eq(1).children()
      .filter('font')
      .each((ind, el) => {
        const font = $(el);
        dates.push({
          date: getTextField(font),
          isCovered: font.attr('color') !== 'red',
        });
      });

    for (let i = 2; i < 5; i += 1) fields.push(getTextField(td.eq(i)));
    const [subject, type, teacher] = fields;

    absences.push({
      dates,
      subject,
      type,
      teacher,
    });
  });

  let currentSession: IAbsenceSession;
  const sessions: IAbsenceSession[] = [];

  $('span.submenu-item').each((index, element) => {
    let session = $(element);
    sessions.push({
      name: getTextField(session),
      number: index + 1,
    });

    // define current period (current period's <a> doesn't have href attr)
    if (!session.find('a.dashed').attr('href')) currentSession = {
      name: getTextField(session),
      number: index + 1
    };
  });

  let overallMissed: string = $('div.span9').text().split(' ').at(-1);

  return { currentSession, sessions, absences, overallMissed: parseInt(overallMissed) };
}
