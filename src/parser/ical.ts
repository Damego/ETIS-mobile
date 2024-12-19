import cheerio from 'cheerio';

export const parseICalToken = (html: string) => {
  const $ = cheerio.load(html);
  return $('input').attr('value').split('/').at(-1);
};
