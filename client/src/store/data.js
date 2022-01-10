import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  code: null,
  name: null,
  enemyName: null,
  enemySymbol: null,
  userKey: 1,
  user1Count: 0,
  user2Count: 0,
  rounds: 1,
  state: "Waiting",
  turn: false,
  winner: "",
};

const dataSlice = createSlice({
  name: "game-data",
  initialState: initalState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },

    setEnemyName(state, action) {
      state.enemyName = action.payload;
    },

    setEnemySymbol(state, action) {
      state.enemySymbol = action.payload;
    },

    setUserKey(state, action) {
      state.userKey = action.payload;
    },

    setCode(state, action) {
      state.code = action.payload;
    },

    setState(state, action) {
      state.state = action.payload;
    },

    setTurn(state, action) {
      state.turn = action.payload;
    },

    winUser1(state) {
      state.user1Count++;
    },

    winUser2(state) {
      state.user2Count++;
    },

    newRound(state) {
      state.rounds++;
    },
    
    setWinner(state, action) {
      state.winner = action.payload;
    },

    playAgainWithBot(state){
      state.user1Count = 0;
      state.user2Count = 0;
      state.winner = "";
      state.enemySymbol = null;
      state.rounds = 1;
    },

    clear(state) {
      state.code = null;
      state.name = null;
      state.enemyName = null;
      state.enemySymbol = null;
      state.userKey = 1;
      state.user1Count = 0;
      state.user2Count = 0;
      state.rounds = 1;
      state.winner = "";
      state.turn = false;
      state.state = "Waiting";
    },
  },
});

export const dataActions = dataSlice.actions;

export default dataSlice.reducer;
