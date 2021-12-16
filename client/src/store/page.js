import { createSlice } from "@reduxjs/toolkit";

const initalState = { isPlayingAI: false, isPlayingMP: false };

const pageSlice = createSlice({
  name: "room",
  initialState: initalState,
  reducers: {
    joinBot(state) {
      state.isPlayingAI = true;
    },

    exitBot(state) {
      state.isPlayingAI = false;
    },

    joinMP(state) {
      state.isPlayingMP = true;
    },

    exitMP(state) {
      state.isPlayingMP = false;
    },
  },
});

export const pageActions = pageSlice.actions;

export default pageSlice.reducer;
