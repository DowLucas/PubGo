import {
  ActionIcon,
  Button,
  Center,
  Container,
  Input,
  Modal,
  TextInput,
  createStyles,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useCreateSavedLocationMutation } from "../features/events/savedLocationsApi";
import { IconX } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  input: {
    marginTop: rem(10),
  },
}));

const CreateSavedLocations = (props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
    libraries: ["places"],
  });
  const [saveLocation] = useCreateSavedLocationMutation();

  const { classes } = useStyles();

  const { opened, close } = props;
  const { initialLocationName } = props;

  const [location, setLocation] = React.useState({
    name: initialLocationName,
    latitude: 0.0,
    longitude: 0.0,
  });

  const autocompleteRef = useRef();

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      setLocation({
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    }
  };

  const validateLocation = () => {
    if (location.name === "") {
      return false;
    }

    // Validate that longitude and latitude are valid
    if (location.latitude < -90 || location.latitude > 90) {
      return false;
    }
    if (location.longitude < -180 || location.longitude > 180) {
      return false;
    }
    return true;
  };

  const onSaveLocation = () => {
    if (!validateLocation()) {
      return;
    }
    console.log("Saving location: " + JSON.stringify(location));
    saveLocation(location).then(() => {});
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={onPlaceChanged}
        onUnmount={() => {
          autocompleteRef.current = null;
        }}
      >
        <TextInput
          withAsterisk
          label="Create Location"
          placeholder={"Name of the location"}
        />
      </Autocomplete>
      <Center className={classes.input}>
        <Button color="pink" size="xs" onClick={onSaveLocation}>
          Save
        </Button>
        {/* Cancel buton with X icon  */}
        <ActionIcon color="red" variant="filled" mx={"sm"}>
          <IconX size="1rem" />
        </ActionIcon>
      </Center>
    </>
  );
};

export default CreateSavedLocations;
