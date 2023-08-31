import { load } from 'cheerio';

import { StudentData } from '../models/student';
import { getTextField } from './utils';

export interface OptionalStudentInfo {
  announceCount?: number;
  messageCount?: number;
  student?: StudentData;
  sessionTestID?: string;
  currentWeek?: number;
  currentSession?: number;
}

export interface StudentInfo {
  announceCount: number;
  messageCount: number;
  student: StudentData;
  sessionTestID: string;
  currentWeek?: number;
  currentSession?: number;
}

export default function parseMenu(html: string, parseGroupJournal = false): StudentInfo {
  const $ = load(html);

  const data: StudentInfo = {
    announceCount: null,
    messageCount: null,
    sessionTestID: null,
    student: {
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

  data.student = {
    name: `${name1} ${name2} ${name3}`,
    speciality,
    educationForm: form,
    year,
    group: null,
  };

  const menu = $('.span3');
  const menuBlocks = menu.find('.nav.nav-tabs.nav-stacked');
  const sessionTestURL = menuBlocks.eq(1).find('li').first().find('a').attr('href');
  const [, sessionTestID] = sessionTestURL.split('=');
  data.sessionTestID = sessionTestID;

  // Получение группы студента
  if (parseGroupJournal) {
    data.student.group = $('.span9').find('h3').text().split(' ').at(1);
  }

  // Получения количества новых уведомлений
  menuBlocks
    .first()
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
