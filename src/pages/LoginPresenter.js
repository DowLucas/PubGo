import React, { useEffect } from "react";
import { createStyles } from "@mantine/core";
import Login from "../features/auth/Login";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser, userSelector, clearCurrentUser } from "../features/usermanagement/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import {
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword,
  selectError,
  setError,
} from "../features/auth/authSlice";

const useStyles = createStyles((theme) => ({
  loginWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "100vh",
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const error = useSelector(selectError);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const {currentUser} = useSelector(userSelector);

  const handleSignInWithGoogle = () => {
      dispatch(signInWithGoogle());
  };

  const handleSignInWithPassword = (userData) => {
    dispatch(signInWithPassword(userData.email, userData.password))
  };

  const handleSignUpWithPassword = (userData) => {
      dispatch(signUpWithPassword(userData.email, userData.password,userData.displayName))
  };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const { uid, displayName, email, photoURL } = user;
          dispatch(setCurrentUser({ uid, displayName, email, photoURL }))
        } else {
          dispatch(clearCurrentUser());
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, [dispatch]);


  // Check auth
  useEffect(() => {
    if (user && currentUser) {
      console.log(currentUser)
      navigate("/");
    }
  }, [ navigate, user,currentUser]);

  useEffect(() => {
    // Clear the error state when the component mounts
    dispatch(setError(null));
  }, [dispatch]);

  return (
    <div className={classes.loginWrapper}>
      <Login 
        handleSignInWithGoogle={handleSignInWithGoogle} 
        handleSignInWithPassword={handleSignInWithPassword} 
        handleSignUpWithPassword={handleSignUpWithPassword} 
        error={error} 
        navigate={navigate}/>
    </div>
  );
};

export default LoginPage;
