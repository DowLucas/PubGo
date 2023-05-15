import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage
import { eventApi } from "../features/events/eventSlice";
import selectedEventSlice from "../features/events/selectedEventSlice";
import { savedLocationsApi } from "../features/events/savedLocationsApi";
import savedLocationsReducer from "../features/events/savedLocationsSlice";
import navbarReducer from "../features/navbar/navbarSlice";
import directionsSlice from "../features/directions/directionsSlice";
import clickerSlice from "../features/clicker/clickerSlice";
import { clickerApi } from "../features/clicker/clickerApi";
import { userApi } from "../features/usermanagement/userApi";


// Configure redux-persist with the desired storage and a key
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["navbar"],
  whitelist: ["auth"], // Only persist the 'auth' state
};

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  selectedEvent: selectedEventSlice,
  savedLocations: savedLocationsReducer,
  navbar: navbarReducer,
  directions: directionsSlice,
  clicker: clickerSlice,
  [clickerApi.reducerPath]: clickerApi.reducer,
  [savedLocationsApi.reducerPath]: savedLocationsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
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
      .concat(userApi.middleware)
      .concat(savedLocationsApi.middleware)
      .concat(clickerApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
