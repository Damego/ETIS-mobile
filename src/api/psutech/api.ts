import axios from 'axios';
import { IAudience, ITimeTable } from '~/models/timeTable';

import { IFaculty, IGroup, IPeriodWeek, ITeacher, PeriodTypes } from './types';

const BASE_URL = 'https://psutech.damego.ru/api';

const inst = axios.create({ baseURL: BASE_URL });

export const getTeacherById = async (teacherId: string) => {
  const res = await inst.get<ITeacher>(`/teachers/${teacherId}`);
  return res.data;
};

export const searchTeachers = async (query: string): Promise<ITeacher[]> => {
  const res = await inst.get(`/teachers/search`, {
    params: {
      query,
    },
  });
  return res.data;
};

export const getFaculties = async (): Promise<IFaculty[]> => {
  const res = await inst.get('/faculties/');
  return res.data;
};

export const searchGroups = async (query: string, facultyId: string): Promise<IGroup[]> => {
  const res = await inst.get('/groups/search', { params: { query, faculty_id: facultyId } });
  return res.data;
};

export const getPeriodWeek = async (
  periodType: PeriodTypes,
  year: number
): Promise<IPeriodWeek> => {
  const res = await inst.get('/periods/', { params: { period_type: periodType, year } });
  return res.data;
};

export const getGroupById = async (groupId: string) => {
  const res = await inst.get<IGroup>(`/groups/${groupId}`);
  return res.data;
};

export const searchAudience = async (query: string, building: string) => {
  const res = await inst.get<IAudience[]>('/audience/search', { params: { query, building } });
  return res.data;
};

export const getAudienceTimetable = async (audienceId: number, week: number) => {
  const res = await inst.get<ITimeTable>(`/audience/${audienceId}/timetable`, {
    params: { week },
  });

  const { data } = res;

  data.weekInfo = data.week_info;

  return res.data;
};
