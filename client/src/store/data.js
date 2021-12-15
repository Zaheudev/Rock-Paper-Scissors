import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  code: null,
  name: null,
  user1Count: 0,
  user2Count: 0,
  rounds: 1,
  winner: '',
};

const dataSlice = createSlice({
  name: "game-data",
  initialState: initalState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },

    setCode(state, action) {
      state.code = action.payload;
    },

    winUser1(state) {
      state.user1Count++;
    },

    winUser2(state) {
      state.user2Count++;
    },

    newRound(state) {
      if (state.rounds < 3) {
        state.rounds++;
      }
    },

    setWinner(state, action) {
      state.winner = action.payload;
    },

    clear(state) {
      state.code = null;
      state.name = null;
      state.user1Count = 0;
      state.user2Count = 0;
      state.rounds = 1;
      state.winner = '';
    },
  },
});

export const dataActions = dataSlice.actions;

export default dataSlice.reducer;
