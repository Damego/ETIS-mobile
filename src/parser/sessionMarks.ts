import { load } from 'cheerio';

import { ISessionMarks } from '../models/sessionMarks';
import { getTextField } from './utils';

export default function parseSessionMarks(html): ISessionMarks[] {
  const $ = load(html);
  const table = $('.common');

  const data: ISessionMarks[] = [];
  let sessionIndex = -1;

  table.find('tr').each((elementIndex, element) => {
    // @ts-ignore
    const tr = table.find(element);
    const title = tr.find('th');

    if (title.length > 1) return;

    if (title.length === 1) {
      const [sessionCourse, rawEndDate] = title.text().split(', ');
      const [sessionString, courseString] = sessionCourse.split('(');
      const sessionNumber = parseInt(sessionString.split(' ').at(0));
      const courseNumber = parseInt(courseString.split(' ').at(0));

      if (rawEndDate === undefined) return;

      const endDate = rawEndDate.split(' ').at(-1).replaceAll('\n', '');

      sessionIndex += 1;
      data[sessionIndex] = {
        session: sessionNumber,
        course: courseNumber,
        fullSessionNumber: courseNumber * sessionNumber,
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
