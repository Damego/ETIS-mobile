import { load } from 'cheerio';
import { getTextField } from './utils';

export default function sessionTestList(html: string) {
  const $ = load(html);

  const list = $(".list");
  const data = []

  list.children().each((elIndex, el) => {
    const element = $((el, list));

    const text = getTextField(element);
    const url = element.find("a").attr("href");

    data.push({
      text,
      url
    })
  });

  return data;
}