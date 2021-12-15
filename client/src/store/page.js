import { createSlice } from '@reduxjs/toolkit';

const initalState = { isPlaying: false };

const pageSlice = createSlice({
  name: "room",
  initialState: initalState,
  reducers: {
    join(state) {
      state.isPlaying = true;
    },

    exit(state) {
      state.isPlaying = false;
    },
  },
});

export const pageActions = pageSlice.actions;

export default pageSlice.reducer;