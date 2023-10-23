import { load } from 'cheerio';

import { StudentData } from '../models/student';
import { getTextField } from './utils';

const nameWithBirthDateRegex = /([а-яА-ЯёЁ\s\w]+) \((\d{2}\.\d{2}\.\d{4}) г\.р\.\)/s;

export interface StudentInfo {
  announceCount: number;
  messageCount: number;
  student: StudentData;
  sessionTestID: string;
  currentWeek?: number;
  currentSession?: number;
  hasUnverifiedEmail: boolean;
}

export default function parseMenu(html: string, parseGroupJournal = false): StudentInfo {
  const $ = load(html);

  const data: StudentInfo = {
    announceCount: null,
    messageCount: null,
    sessionTestID: null,
    hasUnverifiedEmail: false,
    student: {
      name: null,
      speciality: null,
      educationForm: null,
      year: null,
      group: null,
    },
  };

  const content = $('.span9');

  if (content.length === 2) {
    const message = content.eq(0);
    if (getTextField(message).startsWith('Для получения оповещений')) {
      data.hasUnverifiedEmail = true;
    }
  }

  // Получение информации о студенте
  const rawData = getTextField($('.span12'));
  const [nameWithBirthDate, speciality, educationForm, year] = rawData
    .split('\n')
    .map((string) => string.trim());

  // Дата рождения игнорится для будущего возможного функционала (поздравление к примеру)
  const [, name] = nameWithBirthDateRegex.exec(nameWithBirthDate);

  data.student = {
    name,
    speciality,
    educationForm,
    year,
    group: null,
  };

  const menu = $('.span3');
  const menuBlocks = menu.find('.nav.nav-tabs.nav-stacked');
  const sessionTestURL = menuBlocks.eq(1).find('li').first().find('a').attr('href');
  let sessionTestID: string;
  if (sessionTestURL) {
    [, sessionTestID] = sessionTestURL.split('=');
  }
  data.sessionTestID = sessionTestID;

  // Получение группы студента
  if (parseGroupJournal) {
    data.student.group = content.find('h3').text().split(' ').at(1);
  }

  // Получение количества новых уведомлений
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
