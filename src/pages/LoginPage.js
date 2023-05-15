import React, { useState } from "react";
import { createStyles } from "@mantine/core";
import Login from "../features/auth/Login";

const useStyles = createStyles((theme) => ({
  loginWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "100vh",
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.loginWrapper}>
      <Login />
    </div>
  );
};

export default LoginPage;
