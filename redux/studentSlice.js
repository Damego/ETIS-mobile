import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    info: null,
    messageCount: null,
    announceCount: null,
  },
  reducers: {
    setStudentInfo(state, action) {
      state.info = action.payload;
    },
    setMessageCount(state, action) {
      state.messageCount = action.payload;
    },
    setAnnounceCount(state, action) {
      state.announceCount = action.payload;
    },
  },
});

export default studentSlice.reducer;
export const { setStudentInfo, setMessageCount, setAnnounceCount } = studentSlice.actions;
