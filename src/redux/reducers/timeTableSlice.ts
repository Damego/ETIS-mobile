import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ITimeTable } from '../../models/timeTable';

export interface TimeTableState {
  data?: ITimeTable;
  selectedWeek?: number;
  currentWeek?: number;
}

const initialState: TimeTableState = {
  data: undefined,
  selectedWeek: undefined,
  currentWeek: undefined,
};

const timeTableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
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
export const { setData, changeSelectedWeek, setCurrentWeek } =
  timeTableSlice.actions;
