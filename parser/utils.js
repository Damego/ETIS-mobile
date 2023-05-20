import { load } from 'cheerio';
import moment from 'moment/moment';

export const getTextField = (component) => component.text().trim();

export const parseDate = (dateString) => moment(dateString, 'DD.MM.YYYY HH:mm:ss');

export const isLoginPage = (html) => {
  const $ = load(html);
  return !!$('.login').html();
};
