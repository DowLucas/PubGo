import { useEffect, useState } from "react";
import {
  Container,
  Text,
  Input,
  createStyles,
  rem,
  TextInput,
  Textarea,
  Group,
  Button,
  Checkbox,
  Divider,
  LoadingOverlay,
  Select,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { useCreateEventMutation } from "../features/events/eventSlice";
import { useNavigate } from "react-router-dom";
import { useFetchSavedLocationsQuery } from "../features/events/savedLocationsApi";
import { useDisclosure } from "@mantine/hooks";
import CreateSavedLocations from "../components/CreateSavedLocations";
import { useSelector } from "react-redux";
import { savedLocationsSelector } from "../features/events/savedLocationsSlice";

const useStyles = createStyles((_) => ({
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
  const { data: __ } = useFetchSavedLocationsQuery();
  const [data, setData] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [locationName, setLocationName] = useState("");

  const savedLocationsData = useSelector(savedLocationsSelector);

  const { classes, theme } = useStyles();
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      description: "",
      startDateTime: "",
      showNumberOfGuests: false,
      location: {},
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
                <Select
                  className={classes.input}
                  label="Saved Locations"
                  data={savedLocationsData.map((location) => {
                    return {
                      label: location.name,
                      value: location.id,
                      location: {
                        longitude: location.longitude,
                        latitude: location.latitude,
                      },
                    };
                  })}
                  placeholder="Select items"
                  nothingFound="Nothing found"
                  value={form.values.location}
                  searchable
                  creatable
                  onChange={(value) => form.setFieldValue("location", value)}
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    open();
                    setLocationName(query);
                  }}
                  {...form.getInputProps("location")}
                />
                {opened && (
                  <CreateSavedLocations
                    opened={opened}
                    close={close}
                    initialLocationName={locationName}
                  />
                )}
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
