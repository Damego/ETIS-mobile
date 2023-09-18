import { load } from 'cheerio';

import { ISessionMarks } from '../models/sessionMarks';
import { executeRegex } from '../utils/sentry';
import { getTextField } from './utils';

const tableTitleRegex =
  /(?:(\d)\s+([а-я]+)\s+\((\d)\s+[а-я]+\))?(?:[а-я\s,]+(\d{2}.\d{2}.\d{4}))?/s;

export default function parseSessionMarks(html: string): ISessionMarks[] {
  const $ = load(html);
  const table = $('.common');

  const data: ISessionMarks[] = [];
  let sessionIndex = -1;

  table.find('tr').each((elementIndex, element) => {
    // @ts-ignore
    const tr = $(element);
    const title = tr.find('th');

    if (title.length > 1) return;

    if (title.length === 1) {
      const stringData = getTextField(title).replaceAll('\n', ' ');
      const [_, session, sessionName, course, endDate] = executeRegex(tableTitleRegex, stringData);

      if (!endDate) return;

      sessionIndex += 1;
      data[sessionIndex] = {
        session: parseInt(session),
        sessionName,
        course: parseInt(course),
        endDate,
        disciplines: [],
      };

      return;
    }

    const td = tr.find('td');
    data[sessionIndex].disciplines.push({
      name: getTextField(td.eq(0)),
      mark: getTextField(td.eq(1)),
      date: getTextField(td.eq(2)),
      teacher: getTextField(td.eq(3)),
    });
  });

  return data;
}
