import React, { useState } from "react";
import { 
    createStyles,
    Flex,
    LoadingOverlay
 } from "@mantine/core";
import Navbar from "../features/navbar/NavBar";
import Logout from "../features/auth/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Button, Center, Group, Paper, Text, Loader, SimpleGrid, Badge, ScrollArea, ActionIcon, Menu, Table, Input} from "@mantine/core";
import DisplayUserTable from "../components/DisplayUserTable";
import { setCurrentUser, setCurrentUserError, userSelector } from "../features/usermanagement/userSlice";

import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';


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
  const {currentUser} = useSelector(userSelector);
  console.log(currentUser,'drama')
  const error = "prank";
  const { register, handleSubmit, reset } = useForm();
  const addKMUser = (email) => {
    console.log(email);
  }
  const dispatch = useDispatch();
  const handleAddKMUser = (email) => {
    dispatch(addKMUser(email));
  };

  return (
    <div>
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
      <div style={{ width: "80%" }}>
        <form onSubmit={handleSubmit(handleAddKMUser)}>
          {error && <Text color="red">{error}</Text>}
          <Input
            {...register("email")}
            placeholder="Email"
            label="Email *"
            Required
          />
          <Button type="submit">Search</Button>
        </form>
        <DisplayUserTable/>
      <Center mt={30}>
            <Button color="red" variant="light">Logout</Button>
        </Center>
    </div>
      </Flex>
    </div>
  );
};

export default AdminPage;
