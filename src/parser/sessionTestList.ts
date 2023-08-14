import { load } from 'cheerio';
import { getTextField } from './utils';
import { ISessionTestLink } from '../models/sessionTest';

export default function parseSessionTestList(html: string) {
  const $ = load(html);

  const list = $(".list");
  const data: ISessionTestLink[] = []

  list.children().each((elIndex, el) => {
    const element = $(el, list);

    const name = getTextField(element);
    const url = element.find("a").attr("href");

    data.push({
      name,
      url
    })
  });
  return data;
}