import cheerio from 'cheerio';
import { ITeacherContacts } from '~/api/psu/models';

const regex = /'([^']*)'/g;
const phoneRegex = /\+?\d?\s?\(?\d{1,4}\)?[-\s\./0-9]+/g;

const partsToString = (parts: string[]) => parts.map((part) => part.replaceAll("'", '')).join('');

const parseEmail = (script: string) => {
  // хех
  const lines = script.split('\n');
  const part2 = lines.at(-4).match(regex);
  const part1 = lines.at(-5).match(regex);

  return partsToString(part1) + partsToString(part2);
};

export const parseTeacherContacts = (html: string): ITeacherContacts => {
  const $ = cheerio.load(html);
  const article = $('.yutoks-article');

  const emails: string[] = article
    .find('script')
    .map((_, el) => parseEmail($(el).html()))
    .get();

  const phones = [];
  article.children('div').each((_, el) => {
    const text = $(el).text();
    if (text.toLowerCase().includes('тел')) {
      const matches = text.match(phoneRegex);
      phones.push(...matches.map((match) => match.trim()));
    }
  });

  return {
    emails,
    phones,
  };
};
