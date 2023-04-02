import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInWithGoogle,
  selectError,
} from "./authSlice";
import { useNavigate } from "react-router-dom";
import { GoogleIcon } from "./GoogleButton";
import {
  Col,
  Container,
  Grid,
  Paper,
  Button,
  Text,
  Center,
} from "@mantine/core";

export function GoogleButton(props) {
  return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
}

const Login = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
  };

  return (
    <Container>
      <Grid>
        <Col span={12} md={8} lg={6} style={{ margin: "auto" }}>
          <Paper padding="xl" shadow="xs">
            <Center>
              <div style={{ marginBottom: 20 }}>
                <Text align="center" size="xl" weight={500}>
                  Login
                </Text>
              </div>
              {error && (
                <Text color="red" align="center" style={{ marginTop: 10 }}>
                  {error}
                </Text>
              )}
              <div style={{ marginTop: 20 }}>
                <GoogleButton onClick={handleSignInWithGoogle}>
                  Sign in with Google
                </GoogleButton>
              </div>
            </Center>
          </Paper>
        </Col>
      </Grid>
    </Container>
  );
};


export default Login;
