import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudentData, StudentState } from '../../models/student';

const initialState: StudentState = {
  info: null,
  messageCount: null,
  announceCount: null,
}


const studentSlice = createSlice({
  name: 'student',
  initialState: initialState,
  reducers: {
    setStudentInfo(state, action: PayloadAction<StudentData>) {
      state.info = action.payload;
    },
    setMessageCount(state, action: PayloadAction<number>) {
      state.messageCount = action.payload;
    },
    setAnnounceCount(state, action: PayloadAction<number>) {
      state.announceCount = action.payload;
    },
  },
});

export default studentSlice.reducer;
export const { setStudentInfo, setMessageCount, setAnnounceCount } = studentSlice.actions;
