import cheerio from 'cheerio';
import {
  IAdditionalMaterials,
  ICriteria,
  IDisciplineEducationalComplex,
  IDisciplineEducationalComplexThemeLink,
  IEvaluationIndicators,
  IExamQuestions,
  IPlannedLearningOutcome,
} from '~/models/disciplineEducationalComplex';
import { IFile } from '~/models/other';
import { getTextField } from '~/parser/utils';

const parseTheme = (
  $: cheerio.Root,
  themeTag: cheerio.Cheerio
): IDisciplineEducationalComplexThemeLink => {
  const a = themeTag.find('a');
  const name = getTextField(a);
  const [, params] = a.attr('href').split('?');
  const searchParams = new URLSearchParams(params);

  const stringHours = getTextField(themeTag.find('.hour'));
  const [totalHours, classHours] = stringHours.match(/(\d+)/g);

  return {
    id: searchParams.get('p_tc_id'),
    name,
    disciplineTeachPlanId: searchParams.get('p_tpdl_id'),
    hasCheckPoint: !!themeTag.find('.badge.ctl').length,
    subthemes: [],
    workHours: {
      total: Number(totalHours),
      class: Number(classHours),
    },
  };
};

const parseThemes = ($: cheerio.Root) => {
  const themes: IDisciplineEducationalComplexThemeLink[] = [];

  $('.theme').each((_, element) => {
    const themeTag = $(element);
    const $theme = parseTheme($, themeTag);
    const style = themeTag.attr('style');

    if (style === 'padding-left: 0px;') {
      themes.push($theme);
    } else if (style === 'padding-left: 25px;') {
      themes.at(-1).subthemes.push($theme);
    } else if (style === 'padding-left: 50px;') {
      themes.at(-1).subthemes.at(-1).subthemes.push($theme);
    }
  });
  return themes;
};

const parseAdditionalMaterials = ($: cheerio.Root, tag: cheerio.Cheerio): IAdditionalMaterials => {
  const files: IFile[] = [];
  tag
    .find('a')
    .each((_, element) => {
      const linkTag = $(element);
      files.push({
        name: getTextField(linkTag),
        uri: linkTag.attr('href'),
      });
    })
    .get();
  return { files };
};

const parsePlannedLearningOutcome = ($: cheerio.Root, tag: cheerio.Cheerio) => {
  const plannedLearningOutcome: IPlannedLearningOutcome[] = [];

  tag.children('div').each((_, element) => {
    const data = $(element).find('div');

    const plo: IPlannedLearningOutcome = {
      outcome: getTextField(data.eq(0)),
      criteria: data
        .eq(1)
        .find('tr')
        .map((_, trElement) => {
          const trData = $(trElement).find('td');
          return {
            title: getTextField(trData.eq(0)),
            description: getTextField(trData.eq(1)),
          };
        })
        .get(),
    };
    plannedLearningOutcome.push(plo);
  });

  return plannedLearningOutcome;
};

const parseExamQuestions = ($: cheerio.Root, tag: cheerio.Cheerio) => {
  const examQuestions: IExamQuestions[] = [];
  tag.find('a').each((_, element) => {
    const linkTag = $(element);
    const [, id] = linkTag.attr('href').split('=');
    examQuestions.push({
      title: getTextField(linkTag),
      id,
    });
  });

  return examQuestions;
};

const parseEvaluationIndicators = (
  $: cheerio.Root,
  tag: cheerio.Cheerio
): IEvaluationIndicators => {
  const divTags = tag.children('div');
  const data = [];
  for (let i = 0; i < 3; i += 1) {
    data.push(getTextField(divTags.eq(i).contents().eq(1)));
  }
  const [control, method, duration] = data;

  const criteria: ICriteria[] = [];
  tag
    .find('table')
    .find('tr')
    .each((_, trElement) => {
      const trTag = $(trElement);
      const td = trTag.find('td');
      criteria.push({
        title: getTextField(td.eq(0)),
        description: getTextField(td.eq(1)),
      });
    });

  return { control, method, duration, criteria };
};

export const parseDisciplineEducationalComplex = (html: string) => {
  const $ = cheerio.load(html);

  let additionalMaterials: IAdditionalMaterials;
  let plannedLearningOutcome: IPlannedLearningOutcome[] = [];
  let examQuestions: IExamQuestions[] = [];
  let evaluationIndicators: IEvaluationIndicators;

  $('.span9')
    .children()
    .each(function () {
      if (this.name === 'h3') {
        const tag = $(this);
        const text = getTextField(tag);
        if (text === 'Дополнительные материалы') {
          additionalMaterials = parseAdditionalMaterials($, tag.next());
        } else if (text === 'Планируемый результат обучения') {
          plannedLearningOutcome = parsePlannedLearningOutcome($, tag.next());
        } else if (text === 'Вопросы промежуточной аттестации') {
          examQuestions = parseExamQuestions($, tag.next());
        } else if (text === 'Показатели оценивания') {
          evaluationIndicators = parseEvaluationIndicators($, tag.next());
        }
      }
    });

  let discipline = getTextField($('h2').contents().eq(2));
  discipline = discipline.slice(1, discipline.length - 1);

  const data: IDisciplineEducationalComplex = {
    discipline,
    themes: parseThemes($),
    additionalMaterials,
    plannedLearningOutcome,
    examQuestions,
    evaluationIndicators,
  };

  return data;
};
