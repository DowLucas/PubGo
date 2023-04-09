import { createSlice, createSelector } from "@reduxjs/toolkit";
import { savedLocationsApi } from "./savedLocationsApi";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

const savedLocationSlice = createSlice({
  name: "savedLocations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch saved locations
    builder
      .addMatcher(
        savedLocationsApi.endpoints.fetchSavedLocations.matchPending,
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        savedLocationsApi.endpoints.fetchSavedLocations.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addMatcher(
        savedLocationsApi.endpoints.fetchSavedLocations.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );

    // Create saved location
    builder
      .addMatcher(
        savedLocationsApi.endpoints.createSavedLocation.matchPending,
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        savedLocationsApi.endpoints.createSavedLocation.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          console.log("saving", action.payload);
          state.data.push(action.payload);
        }
      )
      .addMatcher(
        savedLocationsApi.endpoints.createSavedLocation.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );

    // Delete saved location
    builder
      .addMatcher(
        savedLocationsApi.endpoints.deleteSavedLocation.matchPending,
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        savedLocationsApi.endpoints.deleteSavedLocation.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.data = state.data.filter(
            (location) => location.id !== action.payload.data.id
          );
        }
      )
      .addMatcher(
        savedLocationsApi.endpoints.deleteSavedLocation.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const savedLocationsSelector = createSelector(
  (state) => state.savedLocations,
  (savedLocations) => savedLocations.data,
);

export default savedLocationSlice.reducer;
