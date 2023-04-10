import React, { useState } from "react";
import { createStyles } from "@mantine/core";
import Logout from "../features/auth/Logout";
import Navbar from "../features/navbar/NavBar";

const useStyles = createStyles((theme) => ({
  logoutWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
}));

const LogoutPage = () => {
  const { classes } = useStyles();

  return (
    <>
      <Navbar />
      <div className={classes.logoutWrapper}>
        <Logout />
      </div>
    </>
  );
};

export default LogoutPage;
