import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { setupListeners } from "@reduxjs/toolkit/query";
import { realtimeDatabaseApi } from "../features/scores/scoresSlice";
import authReducer from "../features/auth/authSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage

// Configure redux-persist with the desired storage and a key
const persistConfig = {
  key: 'root',
  storage,
  blacklist: [realtimeDatabaseApi.reducerPath],
  whitelist: ['auth'], // Only persist the 'auth' state
};

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  [realtimeDatabaseApi.reducerPath]: realtimeDatabaseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore actions related to redux-persist
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
        ignoredPaths: ["auth.user"],
      },
    }).concat(realtimeDatabaseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
