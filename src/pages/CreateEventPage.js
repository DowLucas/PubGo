import { useState } from "react";
import {
  Container,
  Paper,
  Text,
  Col,
  Input,
  InputBase,
  IconChevronDown,
  createStyles,
  rem,
  TextInput,
  Textarea,
  Group,
  Button,
  Stepper,
  Checkbox,
  Center,
  Divider,
  LoadingOverlay,
} from "@mantine/core";

import { FloatingLabelInput } from "../components/FloatingInput";
import { useForm } from "@mantine/form";
import { DateInput, DateTimePicker } from "@mantine/dates";
import { useCreateEventMutation } from "../features/events/eventSlice";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  newEventText: {
    marginTop: rem(100),
    fontSize: rem(40),
    fontFamily: "Roboto",
  },
  input: {
    marginTop: rem(10),
  },
}));

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [createEvent, { isLoading, error }] = useCreateEventMutation();

  const { classes, theme } = useStyles();
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      description: "",
      startDateTime: "",
      showNumberOfGuests: false,
      showEventBusyness: false,
      publicEvent: false,
      termsOfService: false,
    },

    validate: {
      // Name regex longer than 2 characters but shorter than 30
      name: (value) => (/^.{2,30}$/.test(value) ? null : "Invalid name"),
      // Description regex no longer than 150 characters
      description: (value) =>
        /^.{0,150}$/.test(value) ? null : "Invalid description",
      // Event start date cannot be in the past
      startDateTime: (value) => (value > new Date() ? null : "Invalid date"),
      termsOfService: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await createEvent(values);
          navigate("/events");
        })}
      >
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <div id="stepper">
          <Container>
            <Text
              ta="center"
              size="xl"
              weight={800}
              className={classes.newEventText}
            >
              New Event
            </Text>
            {active === 1 && (
              <Input.Wrapper>
                <TextInput
                  className={classes.input}
                  withAsterisk
                  label="Event Name"
                  value={form.values.name}
                  placeholder={"Name of event"}
                  required
                  {...form.getInputProps("name")}
                />
                <Textarea
                  className={classes.input}
                  placeholder="Event description"
                  value={form.values.description}
                  label="Description"
                  {...form.getInputProps("description")}
                />
                <DateTimePicker
                  className={classes.input}
                  valueFormat="DD/MM/YYYY HH:mm"
                  label="Event Start"
                  value={form.values.startDateTime}
                  placeholder="Choose date & time of event"
                  maw={400}
                  required
                  withAsterisk
                  mx="auto"
                  {...form.getInputProps("startDateTime")}
                />
              </Input.Wrapper>
            )}

            {active === 2 && (
              <Input.Wrapper>
                <Checkbox
                  className={classes.input}
                  label="Show number of Guests"
                  color="green"
                  checked={form.values.showNumberOfGuests}
                  disabled={form.values.showEventBusyness}
                  description="If checked, the number of guests will be shown on the event page"
                  radius="xl"
                  size="md"
                  {...form.getInputProps("showNumberOfGuests")}
                />
                <Checkbox
                  className={classes.input}
                  label="Show how crowded the event is"
                  color="green"
                  checked={form.values.showEventBusyness}
                  disabled={form.values.showNumberOfGuests}
                  description="If checked, a message will be shown on the event page to show how crowded the event is."
                  radius="xl"
                  size="md"
                  {...form.getInputProps("showEventBusyness")}
                />
                <Checkbox
                  className={classes.input}
                  label="Public event"
                  color="green"
                  checked={form.values.publicEvent}
                  description="If checked, the event will be public and can be found on the map."
                  radius="xl"
                  size="md"
                  {...form.getInputProps("publicEvent")}
                />
                <Divider my={"xl"} />
                <Checkbox
                  className={classes.input}
                  label="I agree to the terms of service"
                  color="green"
                  description="If checked, you agree to the terms of service"
                  radius="xl"
                  required
                  size="md"
                  {...form.getInputProps("termsOfService")}
                />
              </Input.Wrapper>
            )}
          </Container>
        </div>

        <Group position="center" mt="xl">
          {active > 1 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active === 2 ? (
            <Button type="submit" color="pink" variant="gradient">
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep} color="teal">
              Next
            </Button>
          )}
        </Group>
      </form>
    </>
  );
};
export default CreateEventPage;
