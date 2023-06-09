import React from "react";
import {
  Container,
  Text,
  Input,
  rem,
  TextInput,
  Textarea,
  Group,
  Button,
  Checkbox,
  Divider,
  LoadingOverlay,
  Select,
  SimpleGrid,
  FileInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import CreateSavedLocations from "../../components/CreateSavedLocations";

const CreateEventView = (props) => {
    const {
      isLoading,
      submitForm,
      formErrorNotification,
      classes,
      active,
      handleBannerFileChange,
      form,
      savedLocationsData,
      opened,
      close,
      open,
      prevStep,
      nextStep
    } = props;


    return <form
        onSubmit={form.onSubmit(
          (values, _event) => {
            submitForm(values);
          },
          (validationErrors, _values, _event) => {
            formErrorNotification(validationErrors, _values, _event);
          }
        )}
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
                <SimpleGrid cols={2} spacing="xs">
                  <DateTimePicker
                    className={classes.input}
                    valueFormat="DD/MM/YYYY HH:mm"
                    label="Event Start"
                    value={form.values.startDateTime}
                    placeholder="Choose date & time of event"
                    required
                    withAsterisk
                    {...form.getInputProps("startDateTime")}
                  />
                  <DateTimePicker
                    className={classes.input}
                    valueFormat="DD/MM/YYYY HH:mm"
                    label="Event end"
                    value={form.values.endDateTime}
                    placeholder="Choose date & time of event"
                    required
                    withAsterisk
                    {...form.getInputProps("endDateTime")}
                  />
                </SimpleGrid>
                <FileInput
                  mt={10}
                  placeholder="Add banner"
                  label="Event banner"
                  accept="image/png,image/jpeg"
                  icon={<IconUpload size={rem(14)} />}
                  required
                  onChange={handleBannerFileChange}
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
                  clearable
                  searchable
                  selectOnBlur={true}
                  required
                  withAsterisk
                  onChange={(value) => {
                    form.setFieldValue("location", value);
                  }}
                  {...form.getInputProps("location")}
                />
                <Button color="pink" size="xs" my={10} onClick={open}>
                  Create Location
                </Button>
                <CreateSavedLocations opened={opened} close={close} />
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
                <Checkbox
                  className={classes.input}
                  label="Use clicker"
                  color="green"
                  checked={form.values.useClicker}
                  description="If checked, the event will have a clicker that can be used to count the number of guests."
                  radius="xl"
                  size="md"
                  {...form.getInputProps("useClicker")}
                />
                <Divider my={"xl"} />
                <Checkbox
                  className={classes.input}
                  label="I agree to the terms of service"
                  color="green"
                  description="If checked, you agree to the terms of service"
                  radius="xl"
                  size="md"
                  {...form.getInputProps("termsOfService")}
                />
              </Input.Wrapper>
            )}
          </Container>
        </div>

        <Group position="center" mt="xl">
          {active > 1 && (
            <Button
              variant="default"
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
            >
              Back
            </Button>
          )}
          {active === 2 ? (
            <Button type="submit" color="pink" variant="gradient">
              Submit
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                nextStep();
              }}
              color="teal"
            >
              Next
            </Button>
          )}
        </Group>
      </form>
}

export default CreateEventView;