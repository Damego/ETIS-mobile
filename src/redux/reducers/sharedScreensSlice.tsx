import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ILesson } from '~/models/timeTable';

interface IDisciplineInfoScreenPayload {
  lesson: ILesson;
  pairPosition: number;
  date: string; // ISO
}

interface SharedScreensSlice {
  disciplineInfo: IDisciplineInfoScreenPayload;
}

const initialState: SharedScreensSlice = {
  disciplineInfo: null,
};

const sharedScreensSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDisciplineInfoData(state, action: PayloadAction<IDisciplineInfoScreenPayload>) {
      state.disciplineInfo = action.payload;
    },
  },
});

export default sharedScreensSlice.reducer;
export const { setDisciplineInfoData } = sharedScreensSlice.actions;
