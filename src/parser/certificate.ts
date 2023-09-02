import * as cheerio from 'cheerio';

import { ICertificate, ICertificateAnnounce, ICertificateTable } from '../models/certificate';
import { getTextField } from './utils';

export function parseCertificateTable(html: string): ICertificateTable {
  return {
    certificates: parseCertificates(html),
    announce: parseAnnounces(html),
  };
}
function parseCertificates(html: string): ICertificate[] {
  const $ = cheerio.load(html);
  const data: ICertificate[] = [];

  $('.ord', html).each((el, orderEl) => {
    const order = $(orderEl).find('.ord-name');

    // DD.DD.DDDD {NAME} (код запроса: #DDD, статус: {STATUS})
    const rawText = getTextField(order);
    const parsed =
      /(\d{2}\.\d{2}\.\d{4}) ([а-яА-Я\s,.)("'-]+) \(код запроса: #(\d+), статус: ([а-яА-Я\s,.)("'-]+)\)/.exec(
        rawText
      );
    if (parsed)
      data.push({
        id: parsed[3],
        date: parsed[1],
        name: parsed[2],
        status: parsed[4],
      });
  });

  return data;
}

const parseAnnounceText = (item: cheerio.Cheerio) =>
  item
    .contents()
    .map(function (index, element) {
      if (element.name === 'br' && element.next.name === 'br') return '\n';
      return item.find(element).text();
    })
    .toArray()
    .join('')
    .trim();

function parseAnnounces(html: string): ICertificateAnnounce {
  const $ = cheerio.load(html);
  const selector = $('.span9').children().filter('font');

  const firstItem = selector.eq(0);
  const lastItem = selector.eq(1);

  if (selector.length === 1) {
    return { footer: parseAnnounceText(firstItem) };
  }
  return {
    header: parseAnnounceText(firstItem),
    footer: parseAnnounceText(lastItem),
  };
}

export function cutCertificateHTML(html: string): string {
  const $ = cheerio.load(html);
  return $('.bgprj', html).html();
}
