import { load } from 'cheerio';

import { IOrder } from '../models/order';
import { getTextField } from './utils';

export default function parseOrders(html) {
  const $ = load(html);

  const data: IOrder[] = [];

  $('.ord', html).each((el, orderEl) => {
    const order = $(orderEl).find('.ord-name');
    const uri = order.find('a').attr('href');

    // №DDD от DD.MM.YYYY. {name}
    // Готовится приказ от DD.MM.YYYY. {name}
    const rawText = getTextField(order);
    const dateName = /от (\d\d\.\d\d\.\d{4})\. (.+)/.exec(rawText);
    data.push({
      id: /№(\d+)/.exec(rawText)?.[1],
      date: dateName[1],
      name: dateName[2],
      uri,
    });
  });

  return data;
}
