import React, { useState, useEffect } from "react";
import { createStyles, LoadingOverlay } from "@mantine/core";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "../features/auth/ProfileView";
import Navbar from "../features/navbar/NavBar";
import { useFetchEventsQuery } from "../features/events/eventSlice";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { signOut } from "firebase/auth"
import { auth } from "../firebase";
import { clearUser } from "../features/auth/authSlice";
import { clearCurrentUser, userSelector } from "../features/usermanagement/userSlice";


const useStyles = createStyles((theme) => ({
  logoutWrapper: {
    justifyContent: "center",
  },
}));

const ProfilePage = () => {
  const { classes } = useStyles();
  const { data: events, error, isLoading } = useFetchEventsQuery();
  const currentUser = useSelector(selectUser);
  const databaseUser = useSelector(userSelector);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(clearCurrentUser());
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  
  useEffect(() => {
    if (events) {
      let filteredEvents = events.filter((event) => event.owner === currentUser.uid);
      filteredEvents = filteredEvents.filter((event) => new Date(event.endDateTime) > new Date());
      filteredEvents = [...filteredEvents].sort(
        (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
      );
      setFilteredEvents(filteredEvents);
    }
  }, [events, currentUser.uid]);

  return (
    <>
      <Navbar />
      <div className={classes.logoutWrapper}>
        <Profile events={filteredEvents} user={currentUser} loading={loading} handleLogout={handleLogout} databaseUser={databaseUser}/>
      </div>
    </>
  );
};

export default ProfilePage;
