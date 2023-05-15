import { createSlice, createSelector } from "@reduxjs/toolkit";
import { userApi } from "./userApi";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch saved locations
    builder
      .addMatcher(
        userApi.endpoints.fetchUser.matchPending,
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        userApi.endpoints.fetchUser.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addMatcher(
        userApi.endpoints.fetchUser.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const userSelector = createSelector(
  (state) => state.user,
  (user) => user.data,
);

export default userSlice.reducer;
