import axios from 'axios';
import ical from 'node-ical';
import { convertICalToTimetable } from '~/api/iCal/converter';

const ICAL_BASE_URL = 'https://ical.psu.ru/calendars';
const inst = axios.create({ baseURL: ICAL_BASE_URL });

export const getICalendarData = async (token: string, isLyceum: boolean) => {
  const res = await inst.get(`/${token}`);
  console.log('RETRIEVING Calendar Data with token', token);
  return convertICalToTimetable(ical.sync.parseICS(res.data), isLyceum);
};
