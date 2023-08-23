import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ITimeTable } from '../../models/timeTable';

export interface TimeTableState {
  data?: ITimeTable;
  currentWeek?: number;
}

const initialState: TimeTableState = {
  data: undefined,
  currentWeek: undefined,
};

const timeTableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<ITimeTable>) {
      state.data = action.payload;
    },
    setCurrentWeek(state, action: PayloadAction<number>) {
      state.currentWeek = action.payload;
    },
  },
});

export default timeTableSlice.reducer;
export const { setData, setCurrentWeek } = timeTableSlice.actions;
