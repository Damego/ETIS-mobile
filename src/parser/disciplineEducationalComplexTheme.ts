import cheerio from 'cheerio';
import {
  IDisciplineEducationalComplexTheme,
  IThemeWorkHours,
} from '~/models/disciplineEducationalComplexTheme';
import { getTextField } from '~/parser/utils';

const parseWorkHours = ($: cheerio.Root, tag: cheerio.Cheerio) => {
  const workHours: IThemeWorkHours[] = [];

  tag.find('div').each((_, element) => {
    const divs = $(element).contents();

    workHours.push({
      label: getTextField(divs.eq(0)).split('-').at(0).trim(),
      hours: getTextField(divs.eq(1)).split(' ').at(0).trim(),
    });
  });

  return workHours;
};

const parseList = ($: cheerio.Root, tag: cheerio.Cheerio) => {
  const data = [];
  tag.find('li').each((_, element) => {
    const tag = $(element);
    const aTag = tag.find('a');

    data.push({
      title: getTextField(aTag).trim() || getTextField(tag),
      url: aTag.attr('href'),
    });
  });

  return data;
};

export const parseDisciplineEducationalComplexTheme = (
  html: string
): IDisciplineEducationalComplexTheme => {
  const $ = cheerio.load(html);

  let workHours: IThemeWorkHours[] = [];
  let annotation: string;
  let requiredLiterature = [];
  let additionalLiterature = [];
  let otherLinks = [];
  let controlRequirements = null;

  $('.span9')
    .children()
    .each(function () {
      const tag = $(this);
      const nextTag = tag.next();
      const text = getTextField(tag);

      if (text === 'Трудоемкость') {
        workHours = parseWorkHours($, nextTag);
      } else if (text === 'Аннотация') {
        annotation = getTextField(nextTag);
      } else if (text === 'Обязательная литература') {
        requiredLiterature = parseList($, nextTag);
      } else if (text === 'Дополнительная литература') {
        additionalLiterature = parseList($, nextTag);
      } else if (text === 'Другое обеспечение курса') {
        otherLinks = parseList($, nextTag);
      } else if (text === 'Контроль') {
        controlRequirements = getTextField(nextTag);
      }
    });

  return {
    workHours,
    annotation,
    requiredLiterature,
    additionalLiterature,
    links: otherLinks,
    controlRequirements,
  };
};
