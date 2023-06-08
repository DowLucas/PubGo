import { createSlice } from "@reduxjs/toolkit";

const directionsSlice = createSlice({
  name: "directions",
  initialState: {
    currentLocation: null,
    arrivalDestination: null,
    triggerMapAction: 0,
    triggerDetailsAction: 0,
  },
  reducers: {
    directionsCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    directionsArrivalDestination: (state, action) => {
      state.arrivalDestination = action.payload;
    },
    clearDirections: () => {
      return null;
    },
    triggerMapUpdate: (state) => {
      state.triggerMapAction++;
    },
    triggerDetailsUpdate: (state) => {
      state.triggerDetailsAction++;
    },
  },
});

export const {
  directionsCurrentLocation,
  directionsArrivalDestination,
  clearDirections,
  triggerMapUpdate,
  triggerDetailsUpdate,
} = directionsSlice.actions;
export default directionsSlice.reducer;
