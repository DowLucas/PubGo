import { createSlice } from "@reduxjs/toolkit";


const directionsSlice = createSlice({
  name: "directions",
  initialState: { currentLocation: null, arrivalDestination: null },
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
  },
});

export const { directionsCurrentLocation, directionsArrivalDestination, clearDirections } = directionsSlice.actions;
export default directionsSlice.reducer;
