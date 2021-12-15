import { createSlice } from '@reduxjs/toolkit';

const initalAuthState = { IsAuthenticated: false };

const authSlice = createSlice({
  name: "authentication",
  initialState: initalAuthState,
  reducers: {
    login(state) {
      state.IsAuthenticated = true;
    },

    logout(state) {
      state.IsAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;