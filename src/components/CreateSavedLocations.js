import {
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

  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      name: "",
      latitude: "",
      longitude: "",
    },
    validationRules: {
      name: (value) => value.length > 0 && value.length < 50,
      // Validate that the latitude is a float between -90 and 90
      latitude: (value) => parseFloat(value) >= -90 && parseFloat(value) <= 90,
      // Validate that the longitude is a float between -180 and 180
      longitude: (value) =>
        parseFloat(value) >= -180 && parseFloat(value) <= 180,
    },
  });
  const { opened, close } = props;
  const { initialLocationName } = props;

  const [location, setLocation] = React.useState({
    name: initialLocationName,
    latitude: "",
    longitude: "",
  });

  const autocompleteRef = useRef();

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    console.log(place.geometry.location.lat(), place.name);
    if (place.geometry) {
      setLocation({
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    }
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
          label="Location Name"
          placeholder={"Name of the location"}
        />
      </Autocomplete>
      <Center className={classes.input}>
        <Button color="pink" size="xs">
          Confirm
        </Button>
      </Center>
    </>
  );
};

export default CreateSavedLocations;
