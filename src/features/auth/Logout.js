import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser } from "./authSlice";
import { Button, Center, Group, Paper, Text } from "@mantine/core";
import { LogoMedium } from "../../components/logo/Logo";

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
    <div>
      <Center>
        <LogoMedium />
      </Center>
      <Paper
        radius="md"
        p="sm"
        withBorder
        {...props}
        style={{
          width: "80%",
          margin: "0 auto",
        }}
      >
        <Text size="lg" weight={500}>
          Profile
        </Text>

        <Button onClick={handleLogout}>Logout</Button>
      </Paper>
    </div>
  );
};

export default Logout;
