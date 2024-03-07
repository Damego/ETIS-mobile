import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

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
