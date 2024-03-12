import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

import { DisciplineTypes } from '../models/other';

export const getTextField = (component: cheerio.Cheerio): string => component.text().trim();

export const parseDate = (date: string) => dayjs(date, 'DD.MM.YYYY HH:mm:ss');

export const getAsNumber = (str: string, defaultValue: number = null): number | null => {
  const number = parseFloat(str);
  if (Number.isNaN(number)) return defaultValue;
  return number;
};

export const isLoginPage = (html: string) => {
  const $ = cheerio.load(html);
  return !!$('.login').html();
};

export const getDisciplineType = (string: string): DisciplineTypes =>
  ({
    лек: DisciplineTypes.LECTURE,
    практ: DisciplineTypes.PRACTICE,
    лаб: DisciplineTypes.LABORATORY,
    экзамен: DisciplineTypes.EXAM,
    зачет: DisciplineTypes.TEST,
  })[string];
