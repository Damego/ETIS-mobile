import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ITimeTable } from '../../models/timeTable';

export interface TimeTableState {
  fetchedWeeks: number[];
  data?: ITimeTable;
  selectedWeek?: number;
  currentWeek?: number;
}

const initialState: TimeTableState = {
  fetchedWeeks: [],
  data: undefined,
  selectedWeek: undefined,
  currentWeek: undefined,
};

const timeTableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    addFetchedWeek(state, action: PayloadAction<number>) {
      state.fetchedWeeks.push(action.payload);
    },
    setData(state, action: PayloadAction<ITimeTable>) {
      state.data = action.payload;
    },
    changeSelectedWeek(state, action: PayloadAction<number>) {
      state.selectedWeek = action.payload;
    },
    setCurrentWeek(state, action: PayloadAction<number>) {
      state.currentWeek = action.payload;
    },
  },
});

export default timeTableSlice.reducer;
export const { addFetchedWeek, setData, changeSelectedWeek, setCurrentWeek } =
  timeTableSlice.actions;
