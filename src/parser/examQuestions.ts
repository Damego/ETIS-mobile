import cheerio from 'cheerio';
import { getTextField } from '~/parser/utils';

export const parseExamQuestions = (html: string) => {
  const $ = cheerio.load(html);
  return getTextField($('.span9'));
};
