import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import PrivateRoute from "./features/auth/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import Navbar from "./features/navbar/NavBar";
import ProfilePage from "./pages/ProfilePage";
import ClickerPage from "./pages/ClickerPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute />}>
      <Route index element={<App />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/create" element={<CreateEventPage />} />
      <Route path="/events/:eventId/clicker" element={<ClickerPage />} />
      <Route path="/events/:eventId/edit" element={<EditEventPage />}/>
    </Route>
    {/* <Route path="/" element={<AdminRoute />}>

    </Route> */}
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
