import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { setupListeners } from "@reduxjs/toolkit/query";
import { realtimeDatabaseApi } from "../features/scores/scoresSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [realtimeDatabaseApi.reducerPath]: realtimeDatabaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(realtimeDatabaseApi.middleware),
});

setupListeners(store.dispatch);
