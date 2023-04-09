import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    activeTab: "Home",
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = navbarSlice.actions;

export const selectActiveTab = (state) => state.navbar.activeTab;

export default navbarSlice.reducer;
