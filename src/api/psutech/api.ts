import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { IAudience, ITimeTable } from '~/models/timeTable';

import healthCheck, { isPsutechAvailable } from './healthCheck';
import { IFaculty, IGroup, IPeriodWeek, ITeacher, PeriodTypes } from './types';

export { isPsutechAvailable };

const BASE_URL = 'https://psutech.damego.ru/api';

const inst = axios.create({ baseURL: BASE_URL });

let serviceAvailable: boolean | null = null;

const checkServiceAvailability = async (): Promise<boolean> => {
  if (serviceAvailable !== null) {
    return serviceAvailable;
  }
  serviceAvailable = await healthCheck.check();
  return serviceAvailable;
};

export const getTeacherById = async (teacherId: string) => {
  if (!(await checkServiceAvailability())) {
    return null;
  }
  const res = await inst.get<ITeacher>(`/teachers/${teacherId}`);
  return res.data;
};

export const searchTeachers = async (query: string): Promise<ITeacher[]> => {
  if (!(await checkServiceAvailability())) {
    return [];
  }
  const res = await inst.get(`/teachers/search`, {
    params: {
      query,
    },
  });
  return res.data;
};

export const getFaculties = async (): Promise<IFaculty[]> => {
  if (!(await checkServiceAvailability())) {
    return [];
  }
  const res = await inst.get('/faculties/');
  return res.data;
};

export const searchGroups = async (query: string, facultyId: string): Promise<IGroup[]> => {
  if (!(await checkServiceAvailability())) {
    return [];
  }
  const res = await inst.get('/groups/search', { params: { query, faculty_id: facultyId } });
  return res.data;
};

export const getPeriodWeek = async (
  periodType: PeriodTypes,
  year: number
): Promise<IPeriodWeek> => {
  if (!(await checkServiceAvailability())) {
    const cached = await AsyncStorage.getItem('GROUP_TIMETABLE_PERIOD_WEEK');
    if (cached) return JSON.parse(cached);
    return null;
  }
  
  try {
    const res = await inst.get('/periods/', { params: { period_type: periodType, year } });
    // пока так. SmartCache лучше оставить исключительно на ЕТИС
    await AsyncStorage.setItem('GROUP_TIMETABLE_PERIOD_WEEK', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    const cached = await AsyncStorage.getItem('GROUP_TIMETABLE_PERIOD_WEEK');
    if (cached) return JSON.parse(cached);
    return null;
  }
};

export const getGroupById = async (groupId: string) => {
  if (!(await checkServiceAvailability())) {
    return null;
  }
  const res = await inst.get<IGroup>(`/groups/${groupId}`);
  return res.data;
};

export const searchAudience = async (query: string, building: string) => {
  if (!(await checkServiceAvailability())) {
    return [];
  }
  const res = await inst.get<IAudience[]>('/audience/search', { params: { query, building } });
  return res.data;
};

export const getAudienceTimetable = async (audienceId: number, week: number) => {
  if (!(await checkServiceAvailability())) {
    return null;
  }
  const res = await inst.get<ITimeTable>(`/audience/${audienceId}/timetable`, {
    params: { week },
  });

  const { data } = res;

  data.weekInfo = data.week_info;

  return res.data;
};
