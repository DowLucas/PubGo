import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser } from "./authSlice";
import { Button, Group, Paper, Text } from "@mantine/core";

const Logout = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Profile
        </Text>

        <Button onClick={handleLogout}>Logout</Button>
      </Paper>
    </>
  );
};

export default Logout;
