import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInWithGoogle,
  selectError,
} from "./authSlice";
import { Link, useNavigate } from "react-router-dom";
import { GoogleIcon } from "./GoogleButton";
import {
  Paper,
  Button,
  Text,
  Group,
  Divider,
} from "@mantine/core";


export function GoogleButton(props) {
  const onClickEvent = props.onClick;

  return <Button onClick={onClickEvent} leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
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
      navigate("/");
    }
  }, [navigate, user])

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to PubGo
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton onClick={handleSignInWithGoogle} radius="xl">Google</GoogleButton>
      </Group>

      <Divider label="Please Read T&C" labelPosition="center" my="lg" />
      
      <Link to="/terms">Terms and Conditions</Link>
    </Paper>
  );
};


export default Login;
