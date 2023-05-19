import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser } from "../auth/authSlice";
import {
  Button,
  Center,
  Group,
  Paper,
  Text,
  Loader,
  SimpleGrid,
  Badge,
  ScrollArea,
  ActionIcon,
  Menu,
  Divider,
  Space,
} from "@mantine/core";
import { LogoMedium } from "../../components/logo/Logo";
import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from "@tabler/icons-react";

const Admin = (props) => {
  const { users } = props;

  const filteredUsers = users.filter((user) => {
    if (!user.userData) {
      return false; // filter out users without userData
    } else return true;
  });

  if (!filteredUsers || filteredUsers.length === 0) {
    return <Loader />;
  }

  const rows = filteredUsers.map((user) => (
    <tr key={user.id}>
      <td>
        <Group spacing="sm">
          <div>
            <Text fz="sm" fw={500}>
              {user.userData.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {user.userData.email}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Text fz="sm">{user.userData.kmMember}</Text>
        <Text fz="xs" c="dimmed"></Text>
        <Badge
          color={
            user.userData.kmAdmin === "admin" // check if the value of kmAdmin is "admin"
              ? "green"
              : "grey" // otherwise, use the jobColors object as before
          }
        >
          {user.userData.kmAdmin}
        </Badge>
      </td>
      <td>
        <Group spacing={0} position="right">
          <Menu
            transitionProps={{ transition: "pop" }}
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
                icon={<IconReportAnalytics size="1rem" stroke={1.5} />}
              >
                Make Admin
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size="1rem" stroke={1.5} />}
                color="red"
              >
                Remove user from Pub
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Paper
        radius="md"
        p="sm"
        withBorder
        {...props}
        style={{
          width: "90%",
          margin: "0 auto",
        }}
      >
        <Text size="lg" weight={500}>
          Users
        </Text>
        {rows}
      </Paper>
      <Space h="10vh" />
    </ScrollArea>
  );
};

export default Admin;
