import { createSlice } from "@reduxjs/toolkit";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { login, logout } from "./authThunks";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "idle",
    user: null,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { uid, displayName, email, photoURL } = action.payload;
      state.user = { uid, displayName, email, photoURL };
    },
    clearUser: (state) => {
      state.user = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading"; 
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";                       
        state.user = firebaseUserToObject(action.payload); // Use the helper function
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      });
  },
});

const firebaseUserToObject = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
};

export const { setUser, setError, clearUser } = authSlice.actions;


export const signInWithGoogle = () => async (dispatch) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    dispatch(setUser(firebaseUserToObject(result.user)));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const signInWithPassword = (email,password) => async (dispatch) => {
  try {
    const result = await signInWithEmailAndPassword(auth,email,password);
    dispatch(setUser(firebaseUserToObject(result.user)));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const signUpWithPassword = (email,password,displayName) => async (dispatch) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Set the display name
    await updateProfile(auth.currentUser, { displayName: displayName });
    const updatedResult = firebaseUserToObject(result.user)
    updatedResult.displayName = displayName;
    dispatch(setUser(updatedResult));
  } catch (error) {
    dispatch(setError(error.message));
    console.log(error.message);
  }
};

export const selectUser = (state) => state.auth.user;
export const selectError = (state) => state.auth.error;
export const selectStatus = (state) => state.auth.status;

export default authSlice.reducer;
