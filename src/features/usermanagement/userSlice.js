import { set, ref } from "firebase/database";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { createUser, userApi } from "./userApi";
import { database } from "../../firebase";

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
      const { uid, displayName, email, photoURL } = userData;
      console.log(userData)
      state.currentUser = { ...userData };

        const userRef1 = ref(database, `users/${userData.uid}/userData/email`);
        const userRef2 = ref(database, `users/${userData.uid}/userData/displayName`);
          set(userRef1, email)
          .catch(error => console.error(error));
          set(userRef2, displayName)
          .catch(error => console.error(error));

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
          const matchingIndex = state.data.findIndex(obj => obj.uid === action.payload.uid);
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
          state.error = action.error.message;
          if (action.payload.message === 'Cannot update non-existen user'){
            state.error = action.payload.message;
          }
        }
      );
  },
});


export const { setCurrentUser, setCurrentUserError, clearCurrentUser } = userSlice.actions;


export const userSelector = (state) => state.user;

export default userSlice.reducer;
