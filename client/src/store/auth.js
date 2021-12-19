import { createSlice } from "@reduxjs/toolkit";

const initalAuthState = {
  IsAuthenticated: false,
  isRegister: false,
  isLoging: false,
  error: null,
  username: localStorage.getItem('username'),
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initalAuthState,
  reducers: {
    login(state, action) {
      state.IsAuthenticated = true;
      state.isRegister = false;
      state.isLoging = false;
      state.username = action.payload;
      window.localStorage.setItem("auth", true);
      window.localStorage.setItem("username", action.payload);
    },

    logout(state) {
      window.localStorage.setItem("auth", false);
      state.isRegister = false;
      state.isLoging = false;
      state.error = null;
      state.username = null;
      state.IsAuthenticated = false;
      window.localStorage.setItem("username", null);
    },

    setIsRegisterPage(state, action) {
      state.isRegister = action.payload;
    },

    setIsLogingPage(state, action) {
      state.isLoging = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clear(state) {
      state.IsAuthenticated = false;
      state.isRegister = false;
      state.isLoging = false;
      state.error = null;
      state.username = null;
      window.localStorage.setItem("username", null);
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
