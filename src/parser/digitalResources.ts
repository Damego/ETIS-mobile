import cheerio from 'cheerio';
import { IDigitalResource } from '~/models/digitalResources';
import { getTextField } from '~/parser/utils';

export const parseDigitalResources = (html: string) => {
  const data: IDigitalResource[] = [];
  const $ = cheerio.load(html);

  let currentCategory: string;

  const table = $('#resources');
  table.find('tr').each((index, element) => {
    const tag = $(element);
    const titleTag = tag.find('th');
    if (titleTag.length !== 0) {
      if (titleTag.length === 1) {
        currentCategory = getTextField(tag.find('th'));
      }
      return;
    }

    const td = tag.find('td');
    const [name, loginOrCode, password] = td
      .map((_, tdElement) => getTextField($(tdElement)))
      .get();
    let url: string = null;

    const linkTag = td.eq(0).find('a');
    if (linkTag.length) {
      url = linkTag.attr('href');
    }

    data.push({
      name,
      login: password ? loginOrCode : undefined,
      password,
      accessCode: !password ? loginOrCode.split(':')[1] : undefined,
      url,
      category: currentCategory,
    });
  });

  return data;
};
