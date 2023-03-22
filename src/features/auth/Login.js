import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInWithGoogle,
  selectError,
} from "./authSlice";

const Login = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
  };

  return (
    <div className="login">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
