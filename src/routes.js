import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import PrivateRoute from "./features/auth/PrivateRoute";
import LoginPage from "./pages/LoginPresenter";
import EventsPage from "./pages/EventsPresenter";
import CreateEventPage from "./pages/CreateEventPresenter";
import Navbar from "./features/navbar/NavBar";
import ProfilePage from "./pages/ProfilePresenter";
import ClickerPage from "./pages/ClickerPresenter";
import AdminPage from "./pages/AdminPresenter";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute />}>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/events/create" element={<CreateEventPage />} />
      <Route path="/events/:eventId/clicker" element={<ClickerPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Route>
    {/* <Route path="/" element={<AdminRoute />}>

    </Route> */}
    <Route index element={<EventsPage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
