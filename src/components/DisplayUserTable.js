import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Group, Text, Loader, Badge, ScrollArea, ActionIcon, Menu, Table, Input, Select, Title} from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  IconPencil,
  IconReportAnalytics,
  IconTrash,
} from '@tabler/icons-react';
import {useFetchUserQuery, useUpdateUserMutation} from "../features/usermanagement/userApi.js";
import { useSelector } from "react-redux";
import { userSelector, setCurrentUserError } from "../features/usermanagement/userSlice.js";


const DisplayUserTable = (props) => {
  const [updateUser] = useUpdateUserMutation();
  useFetchUserQuery();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const loadingState = useSelector(userSelector);
  const { currentUser, status, data, error } = loadingState;
  const dispatch = useDispatch();
  let chapterPubs;
  let filteredUsers;

  const handleMakeAdmin = async (userData) => {
    try {
        const updates = {};
        updates['/userData/kmAdmin'] = true;
      if(!userData.userData.hasOwnProperty("kmAdmin")){
        await updateUser({ userData: userData, newData: updates });
        notifications.show({
            title: "Success",
            id: "user-km-admin",
            color: "green",
            message: "The user was added as admin",
            icon: <IconCheck />,
          });
    } else {
        notifications.show({
            title: "User already admin",
            id: "user-already-km-admin",
            color: "red",
            message: "The user is already admin",
            icon: <IconX />,
          });
    }
    } catch (error) {
      notifications.show({
        title: "Could not add admin",
        id: "error-adding-km-admin",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const handleRemoveKmAccess = async (userData) => {
    try {
        if(userData.userData.hasOwnProperty("kmAdmin")){
        const updates = {};
        updates['/userData/kmAdmin'] = false;
        updates['/userData/kmMember'] = null;
      await updateUser({ userData: userData, newData: updates });
      notifications.show({
        title: "User removed",
        id: "removed-km-user",
        color: "green",
        message: "The user was removed from the chapter pub",
        icon: <IconCheck />,
      });
    } else {
        notifications.show({
            title: "Could not remove user",
            id: "error-removing-km-user",
            color: "red",
            message: "User not part of chapter pub",
            icon: <IconX />,
          });
    }
    } catch (error) {
      notifications.show({
        title: "Could not remove user",
        id: "error-removing-km-user",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const handleAddKmUser = async (formData) => {
    try {
        const matchingUser = data.find(obj => obj.userData.email === formData.email);
        //Checks if universal user(site admin) or if the user doesn't already have the KM added
        if(currentUser.kmMember === 'PubGo' || matchingUser.userData.kmMember !== formData.kmMember){
            const updates = {};
            updates['/userData/kmMember'] = formData.kmMember;
            await updateUser({ userData: matchingUser, newData: updates });
            notifications.show({
                title: "User added",
                id: "user-added-km-member",
                color: "green",
                message: "The user was added to this chapter pub",
                icon: <IconCheck />,
              });
        } else {
            notifications.show({
                title: "User already member",
                id: "user-already-km-member",
                color: "red",
                message: "The user is already part of this chapter pub",
                icon: <IconX />,
              });
        }
        reset();
    } catch (error) {
        let errorMessage;
        if (error.message === 'Cannot read properties of undefined (reading \'email\')') {
            errorMessage = 'User does not exist'
        } else { errorMessage = 'Could not add user'}
      notifications.show({
        title: "Could not add user",
        id: "error-adding-km-member",
        color: "red",
        message: errorMessage,
        icon: <IconX />,
      });
      reset();
    }
  };

  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    if (status === "rerender") {
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

  try{
    if(currentUser.kmMember === 'PubGo') {
        chapterPubs = ['DKM', 'CLW', 'MKM', 'KMB', 'OKM', 'NKM'] 
        filteredUsers = data.filter((user) => {
            if (user.hasOwnProperty("userData") && user.userData.hasOwnProperty("kmMember")) {
              return true
            } else return false
        })
    } else if (currentUser.hasOwnProperty("kmMember")){ 
        chapterPubs = [currentUser.kmMember] 
        filteredUsers = data.filter((user) => {
            if (user.hasOwnProperty("userData") && user.userData.hasOwnProperty("kmMember") && (user.userData.kmMember === currentUser.kmMember)) {
              return true
            } else return false
        })
    } else { filteredUsers = []}
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return <div></div>;
    }

//   if (data.length === 0) {
//     return <Text aling='center' >No users</Text>;
//   }

  if (filteredUsers.length === 0) {
    return <div></div>;
  }

  const rows = filteredUsers.map((user) => (
    <tr key={user.uid}>
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
        {currentUser.kmMember && (<Title order={3} mb="xs" align="left" pl="xs">
        {currentUser.kmMember} Users
        </Title>)}
        {currentUser.kmAdmin && ( 
        <form onSubmit={handleSubmit(handleAddKmUser)} style={{ display: "flex", alignItems: "center" }}>
          <Input
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            placeholder="Email"
            label="Email *"
            Required
            error={!!errors.email}
            style={{ width: "70%", margin: '1%' }}
          />
          <Select
            {...register("kmMember")}
            value={watch('kmMembebr')}
            onChange={(value) => setValue('kmMember', value)}
            placeholder="Select a chapter pub"
            data={chapterPubs}
          />
          <Button type="submit" style={{ width: "15%", margin: '1%' }}>Add user</Button>
        </form>
        )}
        <div>
        {currentUser.kmMember && (<ScrollArea h={200} type="scroll">
        <Table 
        withBorder
        highlightOnHover
        style={{ width: "100%", margin: '1%' }}>
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