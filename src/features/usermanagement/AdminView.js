import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser } from "../auth/authSlice";
import { useForm } from "react-hook-form";
import { Button, Center, Group, Paper, Text, Loader, SimpleGrid, Badge, ScrollArea, ActionIcon, Menu, Table, Input} from "@mantine/core";
import { LogoMedium } from "../../components/logo/Logo";
import DisplayUserTable from "../components/DisplayUserTable";
import { useUpdateUserMutation} from "../features/usermanagement/userApi.js";
import { useSelector } from "react-redux";
import { userSelector, selectError } from "../features/usermanagement/userSlice.js";

import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';


const Admin = (props) => {
  const { users } = props;
  //const { isLoading } = props;
  const { error } = props;
  const { register, handleSubmit, reset } = useForm();
  const [updateUser] = useUpdateUserMutation();

  const loadingState = useSelector(userSelector);

  const { currentUser, status, data, usersError } = loadingState;


  const handleAddKmUser = async (userData) => {
    try {
        const updates = {};
        updates['/userData/kmMember'] = currentUser.kmMember;
      await updateUser({ userData: userData, newData: updates });
    } catch (error) {
      console.error("Error setting admin:", usersError);
    }
  };


    return (
      <div style={{ width: "80%" }}>
        <form onSubmit={handleSubmit(handleAddKmUser)}>
          {usersError && <Text color="red">{usersError}</Text>}
          <Input
            {...register("email")}
            placeholder="Email"
            label="Email *"
            Required
          />
          <Button type="submit">Search</Button>
        </form>
        <DisplayUserTable data={props}/>
      <Center mt={30}>
            <Button color="red" variant="light">Logout</Button>
        </Center>
    </div>

    );
};

export default Admin;
