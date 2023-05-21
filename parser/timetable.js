import { load } from 'cheerio';

import { getTextField } from './utils';

export default function parseTimeTable(html) {
  const $ = load(html);
  const week = $('.week');

  let data = {
    firstWeek: parseInt(week.first().text()),
    currentWeek: parseInt($('.week.current').text()),
    lastWeek: parseInt(week.last().text()),
    days: [],
  };

  const { days } = data;

  $('.day', html).each((el, day) => {
    let lessonPosition = 1;
    const daySelector = $(day);
    let lessons = [];
    const date = getTextField(daySelector.find('h3'));

    if (!daySelector.children().last().hasClass('no_pairs')) {
      $('tr', day).each((_, tr) => {
        const trSelector = $(tr);
        const audience = getTextField(trSelector.find('.pair_info').find('.aud'));
        const subject = getTextField(trSelector.find('.pair_info').find('.dis'));
        const time = getTextField(trSelector.find('.pair_num').find('.eval'));
        lessons.push({
          audience,
          subject,
          time,
          lessonPosition,
        });
        lessonPosition += 1;
      });
    }
    days.push({
      date,
      lessons,
    });
  });

  return data;
}
