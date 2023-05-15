import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  signInWithGoogle,
  signInWithPassword,
  selectError,
  setError,
} from "./authSlice";
import { Link, useNavigate } from "react-router-dom";
import { GoogleIcon } from "./GoogleButton";
import { Lock, At } from "tabler-icons-react";
import {
  Paper,
  Button,
  Text,
  Input,
  Group,
  Divider,
  createStyles,
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
  const error = useSelector(selectError);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { register, handleSubmit, reset } = useForm();

  const dispatch = useDispatch();

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
  };

  const handleSignInWithPassword = (userData) => {
    dispatch(signInWithPassword(userData.email, userData.password));
  };

  // Check auth
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    // Clear the error state when the component mounts
    dispatch(setError(null));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      reset();
    }
  }, [reset, error]);

  return (
    <div>
      <Center>
        <CustomLogo width="75%" height="75%" />
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
          Login with Email & Password:
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
    </div>
  );
};

export default Login;
