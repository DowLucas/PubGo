import React, { useState, useEffect } from "react";
import {
  Button,
  Center,
  Avatar,
  Title,
  Box,
  ScrollArea,
  Stack,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import DisplayEventBox from '../../components/DisplayEventBox';

const Profile = (props) => {
  const { 
    user,
    events,
    loading,
    handleLogout
   } = props;

  const eventCards = events.map((event, index) => (
    <div key={event.name}>
      <DisplayEventBox event={event} />
    </div>
  ));

  return (
    <div>
      <Center mt={30} md={20}>
        <Avatar color="cyan" radius="xl" size="xl" src={user.photoURL || null}>
          MK
        </Avatar>
      </Center>
      <Title align="center" mb={20} order={2}>
        {user.displayName || "Username"}
      </Title>
      <Title order={3} mb="xs" align="left" pl="xs">
        My events
      </Title>
      <ScrollArea bg="lightgray" h={350} pt="md" pb="md">
        <Box>
          <Stack align="center">
            {loading ? (
              <Center height="100%">
                <LoadingOverlay visible overlayBlur={2} />
              </Center>
            ) : events.length > 0 ? (
              eventCards
            ) : (
              <Text align="center">You do not have any events.</Text>
            )}
          </Stack>
        </Box>
      </ScrollArea>

      <Center mt={30}>
        <Button onClick={handleLogout} color="red" variant="light">
          Logout
        </Button>
      </Center>
    </div>
  );
};

export default Profile;
