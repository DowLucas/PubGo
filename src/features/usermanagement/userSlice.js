import { createSlice, createSelector } from "@reduxjs/toolkit";
import { userApi } from "./userApi";

const initialState = {
  currentUser: null,
  data: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const userData = action.payload;
      state.currentUser = { ...userData };
      console.log('satte currentUser',state.currentUser)
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setCurrentUserError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
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
      builder
      .addMatcher(
        userApi.endpoints.updateUser.matchPending,
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        userApi.endpoints.updateUser.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          const matchingIndex = state.data.findIndex(obj => obj.id === action.payload.uid);
          if (matchingIndex !== -1) {
            state.data[matchingIndex] = action.payload;
          } else {
            state.status = "rerender";
            console.log('need rerender to show update');
          }
        }
      )
      .addMatcher(
        userApi.endpoints.updateUser.matchRejected,
        (state, action) => {
          state.status = "failed";
          console.log(action.payload)
          console.log(action.payload.message)
          state.error = action.error.message;
          if (action.payload.message === 'User does not exist'){
            state.error = action.payload.message;
          }
        }
      );
  },
});



export const { setCurrentUser, setCurrentUserError, clearCurrentUser } = userSlice.actions;


export const userSelector = (state) => state.user;

export default userSlice.reducer;
