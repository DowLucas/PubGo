import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Center, Group, Paper, Text, Loader, SimpleGrid, Badge, ScrollArea, ActionIcon, Menu, Table, Input} from "@mantine/core";
import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';
import {useFetchUserQuery, useUpdateUserMutation} from "../features/usermanagement/userApi.js";
import { useSelector } from "react-redux";
import { userSelector, setCurrentUserError } from "../features/usermanagement/userSlice.js";


const DisplayUserTable = (props) => {
  const [updateUser] = useUpdateUserMutation();
  useFetchUserQuery();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const loadingState = useSelector(userSelector);
  const { currentUser, status, data, error } = loadingState;
  const dispatch = useDispatch();

  const handleMakeAdmin = async (userData) => {
    try {
        const updates = {};
        updates['/userData/kmAdmin'] = true;
      await updateUser({ userData: userData, newData: updates });
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  };

  const handleRemoveKmAccess = async (userData) => {
    try {
        const updates = {};
        updates['/userData/kmAdmin'] = false;
        updates['/userData/kmMember'] = null;
      await updateUser({ userData: userData, newData: updates });
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  };

  const handleAddKmUser = async (userEmail) => {
    try {
        const matchingIndex = data.findIndex(obj => obj.userData.email === userEmail.email);
        console.log(data[matchingIndex]);
        const updates = {};
        updates['/userData/kmMember'] = currentUser.kmMember;
      await updateUser({ userData: data[matchingIndex], newData: updates });
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  };

  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    if (status === "rerender") {
      // Increment the rerenderKey to trigger a reload
      setRerenderKey((prevKey) => prevKey + 1);
    }
  }, [status]);

  useEffect(() => {
    // Clear the error state when the component mounts
    dispatch(setCurrentUserError(null));
  }, [dispatch]);

  if (status === "loading" || status === "idle" ) {
    return <Loader/>
  }


  if (error) {
    console.log(error)
    if(error !== "User does not exist") {
        return <Text>Error: {error.message}</Text>;
    } else {
        alert("This email is not registered to any user. Please ask the user to register an account before adding them to the Chapter pub");
        dispatch(setCurrentUserError(null));
        reset();
    }
  }

  if (data.length === 0) {
    return <Text>No users</Text>;
  }

  const filteredUsers = data.filter((user) => user.userData.kmMember === currentUser.kmMember);

  if (filteredUsers.length === 0) {
    return <Text>No users added to chapter pub</Text>;
  }

  const rows = filteredUsers.map((user) => (
    <tr key={user.id}>
      <td >
          <div>
            <Text fz="sm" fw={500}>
              {user.userData.name}
            </Text>
          </div>
      </td>
      <td >
          <div>
          <Text fz="sm">
              {user.userData.email}
            </Text>
          </div>
      </td>
      <td>
        <Text fz="xs" c='dimmed'>{user.userData.kmMember}</Text>
      </td>
      <td>
        <div>
        <Badge color={
          user.userData.kmAdmin // check if the value of kmAdmin is true
            ? "green"
            : "grey"
        }
      >
        {user.userData.kmAdmin ? "Admin" : "Member"}
              </Badge>
        </div>
      </td>
      <td>
        {currentUser.kmAdmin && ( // Only render the menu if kmAdmin is true for the current user
          <Group spacing={0} position="right">
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="bottom-end"
              withinPortal
            >
              <Menu.Target>
                <ActionIcon>
                  <IconPencil size="1rem" stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item 
                    icon={<IconReportAnalytics size="1rem" stroke={1.5}/>}
                    onClick={() => handleMakeAdmin(user)}
                    >
                  Make Admin
                </Menu.Item>
                <Menu.Item 
                    icon={<IconTrash size="1rem" stroke={1.5} />} color="red"
                    onClick={() => handleRemoveKmAccess(user)}>
                  Remove user from Pub
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        )}
      </td>
    </tr>
  ));


    return (
    <div>
        {currentUser.kmAdmin && ( 
        <form onSubmit={handleSubmit(handleAddKmUser)} style={{ display: "flex", alignItems: "center" }}>
          <Input
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            placeholder="Email"
            label="Email *"
            Required
            error={!!errors.email}
            style={{ width: "80%", margin: '1%' }}
          />
          <Button type="submit" style={{ width: "15%", margin: '1%' }}>Add user</Button>
        </form>
        )}
        <div>
        {currentUser.kmMember && (<ScrollArea h={250} type="scroll">
        <Table 
        withBorder
        highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Chapter Pub</th>
              <th>Access Level</th>
              {currentUser.kmAdmin && (<th>Edit</th>)}
            </tr>
          </thead>
          <tbody>
            {rows}
            </tbody>
        </Table>
      </ScrollArea>
        )}
      </div>
      </div>
    );
};

export default DisplayUserTable;