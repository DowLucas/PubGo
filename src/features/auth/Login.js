import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleIcon } from "./GoogleButton";
import { Lock, At, MoodSmileBeam } from "tabler-icons-react";
import {
  Paper,
  Button,
  Text,
  Input,
  Group,
  Divider,
  Center,
  Collapse, 
  Box,
  Flex
} from "@mantine/core";
import { CustomLogo } from "../../components/logo/Logo";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "react-hook-form";

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
    handleSignUpWithPassword,
    error,
    navigate
  } = props

  const [opened1, { toggle: toggle1, close: close1 }] = useDisclosure(false);
  const [opened2, { toggle: toggle2, close: close2 }] = useDisclosure(false);
  const { register: registerLogin, handleSubmit: handleSubmitLogin, reset: resetLogin } = useForm();
  const { register: registerSignup, handleSubmit: handleSubmitSignup, reset: resetSignup } = useForm();

  useEffect(() => {
    if (error) {
      resetSignup();
      resetLogin();
    }
  }, [resetSignup, resetLogin, error]);

  const toggleAndClose1 = () => {
    toggle1();
    close2();
  }

  const toggleAndClose2 = () => {
    toggle2();
    close1();
  }

  return (
    <div>
      <Center>
        <CustomLogo width="40%" height="40%" />
      </Center>
      <Text size="lg" weight={500} align="center">
          Welcome to PubGo
        </Text>
      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        size={800}
        style={{
          Width: "80%",
          maxWidth: "600",
          margin: "0 auto",
        }}
      >
        <Flex
          mih={50}
          gap="lg"
          justify="center"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
            <Box maw={400} mx="auto">
              <Group position="center" mb={5}>
                <Button color="teal" radius="md" size="md" onClick={toggleAndClose1}> Login </Button>
              </Group>

              <Collapse in={opened1}>
                <Text fz="sm" c="dimmed" align="center">
                  Login with Google:
                </Text>
                <Group grow mb="md" mt="md">
                  <GoogleButton onClick={handleSignInWithGoogle} radius="xl">
                    Google
                  </GoogleButton>
                </Group>
                <Text fz="sm" c="dimmed" align="center">
                  Login with Email & Password:
                </Text>
                <form 
                  onSubmit={handleSubmitLogin(handleSignInWithPassword)}
                  alignItems= 'center'
                  justifyContent= 'center'>
                  {error && <Text color="red">{error}</Text>}
                  <Input
                    style={{ marginBottom: '1%' }}
                    {...registerLogin("email")}
                    icon={<At />}
                    placeholder="Email"
                    label="Email *"
                    Required
                  />
                  <Input
                    style={{ marginBottom: '1%' }}
                    {...registerLogin("password")}
                    icon={<Lock />}
                    placeholder="Password"
                    type="password"
                    label="Password *"
                    Required
                  />
                  <Button color="teal" radius="md" size="md" id='btnLog' type="submit" align='center'> Login </Button>
                </form>
              </Collapse>
            </Box>
            <Box maw={400} mx="auto">
              <Group position="center" mb={5}>
                <Button color="teal" radius="md" size="md" onClick={toggleAndClose2}>Sign Up</Button>
              </Group>

              <Collapse in={opened2}>
                <Text fz="sm" c="dimmed" align="center">
                  Signup with Google:
                </Text>
                <Group grow mb="md" mt="md">
                  <GoogleButton onClick={handleSignInWithGoogle} radius="xl">
                    Google
                  </GoogleButton>
                </Group>
                <Text fz="sm" c="dimmed" align="center">
                  Sign Up:
                </Text>
                <form onSubmit={handleSubmitSignup(handleSignUpWithPassword)}>
                  {error && <Text color="red">{error}</Text>}
                  <Input
                    style={{ marginBottom: '1%' }}
                    {...registerSignup("displayName")}
                    icon={<MoodSmileBeam />}
                    placeholder="Firstname Lastname"
                    label="Display Name"
                    Required
                  />
                  <Input
                    style={{ marginBottom: '1%' }}
                    {...registerSignup("email")}
                    icon={<At />}
                    placeholder="Email"
                    label="Email *"
                    Required
                  />
                  <Input
                    style={{ marginBottom: '1%' }}
                    {...registerSignup("password")}
                    icon={<Lock />}
                    placeholder="Password"
                    type="password"
                    label="Password *"
                    Required
                  />
                  <Button color="teal" radius="md" size="md" id='btnSign' type="submit" align='center'>Sign Up</Button>
                </form>
              </Collapse>
            </Box>
          </Flex>

        <Divider label="Please Read T&C" labelPosition="center" my="lg" />
        <Center>
          <Link to="/terms">Terms and Conditions</Link>
        </Center>
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
