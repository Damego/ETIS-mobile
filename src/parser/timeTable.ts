import * as cheerio from 'cheerio';

import {
  DistancePlatform,
  DistancePlatformTypes,
  ILesson,
  IPair,
  ITimeTable,
  WeekInfo,
  WeekTypes,
} from '../models/timeTable';
import { httpClient } from '../utils';
import { executeRegex } from '../utils/sentry';
import { getTextField } from './utils';

const dateRegex = /\d+.\d+.\d+/gm;
const audienceRegex = /ауд\. (.*)\/.* \((.*) корпус(?:, (\d) этаж)?\)/s;
const idRegex = /[a-z]*\.[a-z]*\?\#([0-9]*)/s;

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
  if (week.attr('title')?.includes('факультатив')) {
    return WeekTypes.elective;
  }
  return WeekTypes.common;
};

const getDistancePlatformType = (platform: cheerio.Cheerio): DistancePlatformTypes => {
  const title = platform.find('img').attr('title');

  if (title === 'bbb.psu.ru') return DistancePlatformTypes.bbb;
  if (title === 'zoom.us') return DistancePlatformTypes.zoom; // maybe...
  if (platform.attr('href').includes('skype')) return DistancePlatformTypes.skype;

  return DistancePlatformTypes.unknown;
};

const getDistancePlatformName = (platform: cheerio.Cheerio, type: DistancePlatformTypes) => {
  if (type === DistancePlatformTypes.zoom) return 'Платформа Zoom';
  if (type === DistancePlatformTypes.bbb) return 'Платформа BBB';
  if (type === DistancePlatformTypes.skype) return 'Skype';

  const image = platform.find('img');

  return image.attr('title') || platform.attr('href');
};

const getDistancePlatform = (platform: cheerio.Cheerio): DistancePlatform => {
  const image = platform.find('img');
  const type = getDistancePlatformType(platform);

  return {
    name: getDistancePlatformName(platform, type),
    url: platform.attr('href'),
    type,
    imageUrl: httpClient.getSiteURL() + image.attr('src'),
  };
};

export default function parseTimeTable(html: string) {
  const $ = cheerio.load(html);
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
    const pairs: IPair[] = [];
    const date = getTextField(daySelector.find('h3'));
    if (!daySelector.children().last().hasClass('no_pairs')) {
      $('tr', day).each((index, tr) => {
        const lessons: ILesson[] = [];
        const pair = $(tr);
        const pairInfo = pair.find('.pair_info');
        pairInfo.children().each((_, lessonElement) => {
          const lesson = $(lessonElement);
          const subject = getTextField(lesson.find('.dis'));
          const audienceElement = lesson.find('.aud');
          let audienceText: string;
          let floor: string;
          let building: string;
          let audience: string;
          let distancePlatform: DistancePlatform;

          const platform = audienceElement.find('a');
          if (platform.length === 1) {
            distancePlatform = getDistancePlatform(platform);
          } else {
            audienceText = getTextField(audienceElement);
            const regexResult = executeRegex(audienceRegex, audienceText);
            if (regexResult) {
              [, audience, building, floor] = regexResult;
            }
          }

          const teacherAnchor = lesson.find('.teacher').find('a');
          const [, teacherId] = executeRegex(idRegex, teacherAnchor.attr('href'));

          lessons.push({
            audienceText,
            audience,
            building,
            floor,
            subject,
            isDistance: audience === 'Дистанционно' || !!distancePlatform,
            distancePlatform,
            teacherId,
          });
        });

        const pairTime = getTextField(pair.find('.pair_num').find('.eval'));
        pairs.push({
          time: pairTime,
          position: index + 1,
          lessons,
        });
      });
    }
    days.push({
      date,
      pairs,
    });
  });

  return data;
}
