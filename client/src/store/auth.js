import { createSlice } from "@reduxjs/toolkit";

const initalAuthState = {
  IsAuthenticated: true,
  isRegister: false,
  isLoging: false,
};

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

    setIsRegisterPage(state, action) {
      state.isRegister = action.payload;
    },

    setIsLogingPage(state, action) {
      state.isLoging = action.payload;
    },

    clear(state) {
      state.IsAuthenticated = false;
      state.isRegister = false;
      state.isLoging = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
