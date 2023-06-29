import { load } from 'cheerio';

import { ILesson, ITimeTable } from '../models/timeTable';
import { getTextField } from './utils';

export default function parseTimeTable(html) {
  const $ = load(html);
  const week = $('.week');

  const data: ITimeTable = {
    firstWeek: parseInt(week.first().text()),
    selectedWeek: parseInt($('.week.current').text()),
    lastWeek: parseInt(week.last().text()),
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
