import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import pageReducer from "./page";
import dataReducer from "./data";

const store = configureStore({
  reducer: { data: dataReducer, auth: authReducer, page: pageReducer },
});

export default store;