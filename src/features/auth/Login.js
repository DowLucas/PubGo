import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signInWithGoogle, selectError } from "./authSlice";
import { Link, useNavigate } from "react-router-dom";
import { GoogleIcon } from "./GoogleButton";
import {
  Paper,
  Button,
  Text,
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

  const dispatch = useDispatch();

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
  };

  // Check auth
  useEffect(() => {
    if (user) {
      navigate("/events");
    }
  }, [navigate, user]);

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

        <Group grow mb="md" mt="md">
          <GoogleButton onClick={handleSignInWithGoogle} radius="xl">
            Google
          </GoogleButton>
        </Group>

        <Divider label="Please Read T&C" labelPosition="center" my="lg" />

        <Link to="/terms">Terms and Conditions</Link>
      </Paper>
    </div>
  );
};

export default Login;
