import * as cheerio from 'cheerio';
import moment from 'moment/moment';

export const getTextField = (component: cheerio.Cheerio): string => component.text().trim();

export const parseDate = (date: string) => moment(date, 'DD.MM.YYYY HH:mm:ss');

export const isLoginPage = (html) => {
  const $ = cheerio.load(html);
  return !!$('.login').html();
};
