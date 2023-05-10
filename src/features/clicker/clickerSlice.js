import { createSlice } from "@reduxjs/toolkit";

export const clickerSlice = createSlice({
  name: "clicker",
  initialState: {
    value: 0,
  },
  reducers: {
    setClickerValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setClickerValue } = clickerSlice.actions;

export default clickerSlice.reducer;
