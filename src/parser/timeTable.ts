import { load } from 'cheerio';

import { ILesson, ITimeTable, WeekInfo, WeekTypes } from '../models/timeTable';
import { getTextField } from './utils';

const dateRegex = /\d+.\d+.\d+/gm;

const getWeekType = (week: cheerio.Cheerio): WeekTypes => {
  if (week.hasClass('holiday')) {
    return WeekTypes.holiday;
  }
  if (week.hasClass('session')) {
    return WeekTypes.session;
  }
  if (week.hasClass('pract')) {
    return WeekTypes.practice;
  }
  if (week.attr('title').includes('факультатив')) {
    return WeekTypes.elective;
  }
  return WeekTypes.common;
};

export default function parseTimeTable(html) {
  const $ = load(html);
  const week = $('.week');
  const currentWeek = $('.week.current');

  const weekInfo: WeekInfo = {
    first: parseInt(week.first().text()),
    selected: parseInt(currentWeek.text()),
    last: parseInt(week.last().text()),
    type: getWeekType(currentWeek),
    holidayDates: null,
    dates: null,
  };

  const dates = getTextField($('.week-select').children().last());
  if (dates) {
    const [weekStart, weekEnd, holidayStart, holidayEnd] = dates.match(dateRegex);
    weekInfo.dates = {
      start: weekStart,
      end: weekEnd,
    };
    weekInfo.holidayDates = {
      start: holidayStart,
      end: holidayEnd,
    };
  }

  const data: ITimeTable = {
    weekInfo,
    days: [],
  };

  const { days } = data;

  $('.day', html).each((el, day) => {
    const daySelector = $(day);
    const lessons: ILesson[] = [];
    const date = getTextField(daySelector.find('h3'));

    if (!daySelector.children().last().hasClass('no_pairs')) {
      $('tr', day).each((index, tr) => {
        const trSelector = $(tr);
        const audience = getTextField(trSelector.find('.pair_info').find('.aud'));
        const subject = getTextField(trSelector.find('.pair_info').find('.dis'));
        const time = getTextField(trSelector.find('.pair_num').find('.eval'));
        lessons.push({
          audience,
          subject,
          time,
          lessonPosition: index + 1,
        });
      });
    }
    days.push({
      date,
      lessons,
    });
  });

  return data;
}
