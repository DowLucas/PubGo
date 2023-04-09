import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./features/auth/Login";
import Logout from "./features/auth/Logout";
import PrivateRoute from "./features/auth/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import Navbar from "./features/navbar/NavBar";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute />}>
      <Route index element={<App />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/create" element={<CreateEventPage />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
