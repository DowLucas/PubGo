import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser } from "../auth/authSlice";
import { Button, Center, Group, Paper, Text, Loader, SimpleGrid, List } from "@mantine/core";
import { LogoMedium } from "../../components/logo/Logo";


const Admin = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = props;
  console.log(users);
  console.log("hi");

  if (!users || users.length === 0) {
    return <Loader />;
  }

  const rows = users.map((user, index) => (
    <div key={user.name}>
      <List user={user} />
    </div>
  ));

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
          Admin
        </Text>

        <Button onClick={handleLogout}>Logout</Button>

        <Text size="lg" weight={500}>
          API call
        </Text>
        <SimpleGrid>
        {rows}
      </SimpleGrid>
      </Paper>
    </div>
  );
};

export default Admin;
