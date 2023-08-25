import { load } from 'cheerio';
import { getTextField } from './utils';
import { ISessionQuestionnaireLink } from '../models/sessionQuestionnaire';

export default function parseSessionQuestionnaireList(html: string) {
  const $ = load(html);

  const list = $(".list");
  const data: ISessionQuestionnaireLink[] = []

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