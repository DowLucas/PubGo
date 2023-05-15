import { createSlice } from "@reduxjs/toolkit";


const directionsSlice = createSlice({
  name: "directions",
  initialState: { currentLocation: null, arrivalDestination: null, triggerMapAction: 0, triggerDetailsAction: 0 },
  reducers: {
    directionsCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      console.log("curr location state changed")
    },
    directionsArrivalDestination: (state, action) => {
        state.arrivalDestination = action.payload;
        console.log("arrival location state changed")
      },
    clearDirections: () => {
      return null;
    },
    triggerMapUpdate: (state) => {
      state.triggerMapAction++;
      console.log("map state changed")
    },
    triggerDetailsUpdate: (state) => {
      state.triggerDetailsAction++;
      console.log("details state changed")
    },
  },
});

export const { directionsCurrentLocation, directionsArrivalDestination, clearDirections, triggerMapUpdate, triggerDetailsUpdate } = directionsSlice.actions;
export default directionsSlice.reducer;
