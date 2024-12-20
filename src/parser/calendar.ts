import { load } from 'cheerio';
import { capitalizeWord } from '~/utils/texts';

import { ICalendarSchedule } from '../models/calendarSchedule';

const courseRegex = /\d/;

export default function parseCalendarSchedule(html: string): ICalendarSchedule {
  const $ = load(html);
  const data: ICalendarSchedule = {
    course: null,
    sessions: [],
  };
  let d = {
    title: null,
    dates: [],
  };
  const block = $('.span9');
  let pending = false;
  block.children().each((index, element) => {
    const el = $(element, block);

    if (el.is('h3')) {
      const [course] = el.text().match(courseRegex);
      data.course = parseInt(course);
      pending = true;
      return;
    }
    if (!pending) {
      return;
    }

    if (el.is('br')) {
      pending = false;
      return false;
    }

    if (el.is('p')) {
      if (d.title) {
        data.sessions.push(d);
        d = {
          title: null,
          dates: [],
        };
      }
      const text = el.text();
      if (!text) return;

      const title = text.trim();
      d.title = capitalizeWord(title);
    }
    if (el.is('div')) {
      d.dates.push(el.text());
    }
  });

  return data;
}
