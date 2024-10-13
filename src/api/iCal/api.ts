import ical from 'node-ical';
import axios from 'axios';

const ICAL_BASE_URL = 'https://ical.psu.ru/calendars';
const inst = axios.create({ baseURL: ICAL_BASE_URL });

export const getICalendarData = async (token: string) => {
  const res = await inst.get(`/${token}`);
  return ical.sync.parseICS(res.data);
};
