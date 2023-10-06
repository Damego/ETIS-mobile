import * as cheerio from 'cheerio';

import { getTextField } from './utils';

/*
 * Парсит страницу для изменения электронной почты.
 * Возвращает ошибку в виде строки
 */
export const parseChangeEmailPage = (email: string): string => {
  const $ = cheerio.load(email);

  const div = $('.span9').children().filter('div');
  if (div.length === 2) {
    return getTextField(div.eq(1).contents().last());
  }
};
