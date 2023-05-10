import React, { useState } from "react";
import { createStyles, LoadingOverlay } from "@mantine/core";
import Profile from "../features/auth/Profile";
import Navbar from "../features/navbar/NavBar";
import { useFetchEventsQuery } from "../features/events/eventSlice";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

const useStyles = createStyles((theme) => ({
  logoutWrapper: {
    justifyContent: "center",
  },
}));

const ProfilePage = () => {
  const { classes } = useStyles();
  const { data: events, error, isLoading } = useFetchEventsQuery();
  
  const currentUser = useSelector(selectUser);
  
  if (!events) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  let filteredEvents = events.filter((event) => event.owner === currentUser.uid);
  filteredEvents = filteredEvents.filter((event) => new Date(event.endDateTime) > new Date());
  filteredEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
  );

  return (
    <>
      <Navbar />
      <div className={classes.logoutWrapper}>
        <Profile events={filteredEvents} user={currentUser}/>
      </div>
    </>
  );
};

export default ProfilePage;
