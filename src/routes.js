import React from "react";
import {
    Routes,
    Route,
  } from "react-router-dom";
import App from "./App";
import Login from "./features/auth/Login";
import Logout from "./features/auth/Logout";
import PrivateRoute from "./features/auth/PrivateRoute";

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<PrivateRoute />} >
        <Route index element={<App />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
);


export default AppRoutes;