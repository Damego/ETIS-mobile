import { load } from 'cheerio';

import { getTextField } from './utils';
import { StudentData } from '../models/student';

export interface MenuParseResult {
  announceCount: number;
  messageCount: number;
  studentInfo: StudentData;
}

export default function parseMenu(html, parseGroupJournal = false): MenuParseResult {
  const $ = load(html);

  const data: MenuParseResult = {
    announceCount: null,
    messageCount: null,
    studentInfo: {
      name: null,
      speciality: null,
      educationForm: null,
      year: null,
      group: null,
    },
  };

  // Получение информации о студенте
  const rawData = getTextField($('.span12'));
  const [rawName, speciality, form, year] = rawData.split('\n').map((string) => string.trim());
  const [name1, name2, name3] = rawName.split(' ');

  data.studentInfo = {
    name: `${name1} ${name2} ${name3}`,
    speciality,
    educationForm: form,
    year,
    group: null
  };

  // Получение группы студента
  if (parseGroupJournal) {
    data.studentInfo.group = $('.span9').find('h3').text().split(' ').at(1);
  }

  // Получения количества новых уведомлений
  $('.nav.nav-tabs.nav-stacked')
    .find('.badge')
    .each((i, el) => {
      const span = $(el);
      const href = span.parent().attr('href');
      if (href === 'stu.announce') {
        data.announceCount = parseInt(getTextField(span));
      } else if (href === 'stu.teacher_notes') {
        data.messageCount = parseInt(getTextField(span));
      }
    });

  return data;
}
