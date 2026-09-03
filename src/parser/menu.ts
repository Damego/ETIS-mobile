import { load } from 'cheerio';

import { StudentData } from '~/models/student';

import { getTextField } from './utils';

const nameWithBirthDateRegex = /([а-яА-ЯёЁ\s\w]+) \((\d{2}\.\d{2}\.\d{4}) г\.р\.\)/s;

export interface StudentInfo {
  announceCount: number | null;
  messageCount: number | null;
  student: StudentData;
  sessionTestID: string | null;
  currentWeek?: number;
  currentSession?: number;
  firstWeek?: number;
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
      isLyceum: false,
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
    .map((string) => string.trim())
    .filter(Boolean);

  // Дата рождения игнорится для будущего возможного функционала (поздравление к примеру)
  let name: string | null = null;
  const nameMatch = nameWithBirthDate
    ? nameWithBirthDateRegex.exec(nameWithBirthDate)
    : null;
  if (nameMatch) {
    [, name] = nameMatch;
  }

  data.student = {
    name,
    speciality: speciality ?? null,
    educationForm: educationForm ?? null,
    year: year ?? null,
    group: null,
    groupShort: null,
    isLyceum: Boolean(speciality) && (speciality.startsWith('Лицей') || speciality.endsWith('класс')), // TODO: Убрать лишнее, как только узнаем правду
  };

  const menu = $('.span3');
  const menuBlocks = menu.find('.nav.nav-tabs.nav-stacked');
  const sessionTestURL = menuBlocks.eq(1).find('li').first().find('a').attr('href');
  let sessionTestID: string | undefined;
  if (sessionTestURL) {
    [, sessionTestID] = sessionTestURL.split('=');
  }
  data.sessionTestID = sessionTestID ?? null;

  // Получение группы студента
  if (parseGroupJournal) {
    const group = content.find('h3').text().trim().split(' ').at(1);
    if (typeof group === 'string' && group.length > 0) {
      data.student.group = group;
      // Структура группы: ГРП-1-2024
      const [groupName, groupNumber] = group.split('-');
      data.student.groupShort = `${groupName}-${groupNumber}`;
      if (!data.student.isLyceum) {
        data.student.isLyceum = group.startsWith('ЛЦ');
      }
    }
  }

  // Получение количества новых уведомлений
  menuBlocks
    .first()
    .find('.badge')
    .each((i, el) => {
      const span = $(el);
      const href = span.parent().attr('href');
      if (href === 'stu_ann.announces') {
        data.announceCount = parseInt(getTextField(span));
      } else if (href === 'stu.teacher_notes') {
        data.messageCount = parseInt(getTextField(span));
      }
    });

  return data;
}
