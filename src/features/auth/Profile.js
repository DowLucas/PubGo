import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser } from "./authSlice";
import { Button, Center, Avatar, Title, Box, ScrollArea, Stack} from "@mantine/core";
import { LogoMedium } from "../../components/logo/Logo";
import DisplayEventBox from '../../components/DisplayEventBox';

const Profile = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = props;
  const { events } = props;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const eventCards = events.map((event, index) => (
    <div key={event.name}>
        <DisplayEventBox event={event}/>
    </div>
  ));

  return (
    <div>
        <Center mt={30} md={20}>
            <Avatar color="cyan" radius="xl" size="xl">MK</Avatar>
        </Center>
        <Title align="center" mb={20} order={2}>{user.username || "Username"}</Title>
            <Title order={3} mb="xs" align="left" pl="xs">My events</Title>
            <ScrollArea bg="lightgray" h={350} pt="md" pb="md">
                <Box>
                    <Stack align="center">
                    {eventCards}
                    </Stack>
                </Box>
            </ScrollArea>

        <Center mt={30}>
            <Button onClick={handleLogout} color="red" variant="light">Logout</Button>
        </Center>
    </div>
  );
};

export default Profile;