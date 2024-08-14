export interface IGroupTimetablePayload {
  groupId: string;
  facultyId: string;
  course: number;
  period: number;
  year: number;
  week: number;
}

export interface ITeacherInfo {
  name: string;
  shortName: string;
  photoUrl: string;
  photoLoadedDate: string;
}
