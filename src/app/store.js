import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { realtimeDatabaseApi } from "../features/scores/scoresSlice";
import authReducer from "../features/auth/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage
import { eventApi } from "../features/events/eventSlice";
import selectedEventSlice from "../features/events/selectedEventSlice";
import { savedLocationsApi } from "../features/events/savedLocationsApi";
import savedLocationsReducer from '../features/events/savedLocationsSlice'

// Configure redux-persist with the desired storage and a key
const persistConfig = {
  key: "root",
  storage,
  blacklist: [realtimeDatabaseApi.reducerPaths],
  whitelist: ["auth"], // Only persist the 'auth' state
};

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  selectedEvent: selectedEventSlice,
  savedLocations: savedLocationsReducer,
  [savedLocationsApi.reducerPath]: savedLocationsApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
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
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["auth.user"],
      },
    })
      .concat(eventApi.middleware)
      .concat(realtimeDatabaseApi.middleware)
      .concat(savedLocationsApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
