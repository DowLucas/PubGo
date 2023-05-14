import React, { useState } from "react";
import { 
    createStyles,
    LoadingOverlay
 } from "@mantine/core";
import Admin from "../features/usermanagement/Admin";
import {useFetchUserQuery} from "../features/usermanagement/userApi.js";
import Navbar from "../features/navbar/NavBar";


const useStyles = createStyles((theme) => ({
  logoutWrapper: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
  },
}));

const AdminPage = () => {
  const { classes } = useStyles();

  const { data: users, error, isLoading } = useFetchUserQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Navbar />
      <div className={classes.logoutWrapper}>
      <Admin users={users} />
      </div>
    </>
  );
};

export default AdminPage;
