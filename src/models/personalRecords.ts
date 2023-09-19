export interface IPersonalRecord {
  id?: string; // undefined if it's current record
  index: number; // needed for cache stuff
  year: string;
  speciality: string;
  faculty: string;
  educationForm: string;
  status: string;
}
