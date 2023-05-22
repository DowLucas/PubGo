import React, { useState } from "react";
import {
  Center,
  createStyles,
  Flex,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import Admin from "../features/usermanagement/AdminView";
import { useFetchUserQuery } from "../features/usermanagement/userApi.js";
import Navbar from "../features/navbar/NavBar";
import Logout from "../features/auth/Logout";
import { LogoMedium } from "../components/logo/Logo";

const useStyles = createStyles((theme) => ({
  logoutWrapper: {
    display: "flex",
    alignContent: "column",
    justifyContent: "center",
    height: "",
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
      <Flex
        //mih={50}
        //bg="rgba(0, 0, 0, .3)"
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="nowrap"
      >
        <Center>
          <LogoMedium />
        </Center>
        <Text size="xl" weight={500}>
          Admin Page
        </Text>
        <Admin users={users} />
      </Flex>
    </>
  );
};

export default AdminPage;
