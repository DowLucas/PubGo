import React from "react";
import { Link } from "react-router-dom";
import { GoogleIcon } from "./GoogleButton";
import { Lock, At } from "tabler-icons-react";
import {
  Paper,
  Button,
  Text,
  Input,
  Group,
  Divider,
  Center,
} from "@mantine/core";
import LogoLarge, { CustomLogo, LogoMedium } from "../../components/logo/Logo";

export function GoogleButton(props) {
  const onClickEvent = props.onClick;

  return (
    <Button
      onClick={onClickEvent}
      leftIcon={<GoogleIcon />}
      variant="default"
      color="gray"
      {...props}
    />
  );
}

const Login = (props) => {
  const {
    handleSignInWithGoogle,
    handleSignInWithPassword,
    handleSubmit,
    register,
    error,
    navigate
  } = props

  return (
    <div>
      <Center>
        <CustomLogo width="40%" height="40%" />
      </Center>
      <Paper
        radius="md"
        p="xl"
        withBorder
        style={{
          width: "80%",
          margin: "0 auto",
        }}
      >
        <Text size="lg" weight={500}>
          Welcome to PubGo
        </Text>

        <Text size="md" color="gray">
          Login with Google:
        </Text>
        <Group grow mb="md" mt="md">
          <GoogleButton onClick={handleSignInWithGoogle} radius="xl">
            Google
          </GoogleButton>
        </Group>
        <Text size="md" color="gray">
          Login with Email & Password given by admin:
        </Text>
        <form onSubmit={handleSubmit(handleSignInWithPassword)}>
          {error && <Text color="red">{error}</Text>}
          <Input
            {...register("email")}
            icon={<At />}
            placeholder="Email"
            label="Email *"
            Required
          />
          <Input
            {...register("password")}
            icon={<Lock />}
            placeholder="Password"
            type="password"
            label="Password *"
            Required
          />
          <Button type="submit">Login</Button>
        </form>

        <Divider label="Please Read T&C" labelPosition="center" my="lg" />

        <Link to="/terms">Terms and Conditions</Link>
      </Paper>
      <Center>
        <Button
          variant="link"
          onClick={() => {
            navigate("/");
          }}
        >
          <Text color="gray">Back to Map</Text>
        </Button>
      </Center>
    </div>
  );
};

export default Login;
