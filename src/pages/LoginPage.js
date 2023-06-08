import React, { useEffect } from "react";
import { createStyles } from "@mantine/core";
import Login from "../features/auth/Login";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation, useFetchSingleUserQuery } from "../features/usermanagement/userApi";
import { setCurrentUser, userSelector } from "../features/usermanagement/userSlice";

import {
  signInWithGoogle,
  signInWithPassword,
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
  const { register, handleSubmit, reset } = useForm();
  const [saveUser] = useCreateUserMutation();
  const dispatch = useDispatch();
  const fetchUserQuery = useFetchSingleUserQuery(user);

  const { data: userData, error: userError } = fetchUserQuery;
  const {currentUser} = useSelector(userSelector);

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
  };

  const handleSignInWithPassword = (userData) => {
    dispatch(signInWithPassword(userData.email, userData.password))
  };

  useEffect(() => {
    if (user && !userData) {
      fetchUserQuery.refetch();
    }
    if (userError) {
      console.log(userError, "bing");
    }
  }, [user, fetchUserQuery, userData, userError, currentUser]);
  
  useEffect(() => {
    if (userData && !currentUser) {
      dispatch(setCurrentUser(userData));
    }
  }, [user, userData, dispatch, currentUser]);

  // Check auth
  useEffect(() => {
    if (user && currentUser) {
      console.log(currentUser,'hi');
      navigate("/");
    }
  }, [ navigate, user, currentUser]);

  useEffect(() => {
    // Clear the error state when the component mounts
    dispatch(setError(null));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      reset();
    }
  }, [reset, error]);

  return (
    <div className={classes.loginWrapper}>
      <Login handleSignInWithGoogle={handleSignInWithGoogle} handleSubmit={handleSubmit} handleSignInWithPassword={handleSignInWithPassword} register={register} error={error} navigate={navigate}/>
    </div>
  );
};

export default LoginPage;
