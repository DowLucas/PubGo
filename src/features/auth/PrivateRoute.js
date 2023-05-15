import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { clearUser, setUser } from "./authSlice";
import { auth } from "../../firebase";

const PrivateRoute = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        dispatch(setUser({ uid, displayName, email, photoURL }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
