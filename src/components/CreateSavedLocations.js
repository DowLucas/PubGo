import {
  Button,
  Group,
  Modal,
  TextInput,
  createStyles,
  rem,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useCreateSavedLocationMutation } from "../features/events/savedLocationsApi";
import { KTHCenter } from "../utils/const";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  input: {
    marginTop: rem(10),
  },
}));

const mapOptions = {
  disableDefaultUI: true,
  fullscreenControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.school",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
  ],
};

const libraries = ["places"];

const CreateSavedLocations = (props) => {
  // const { isLoaded, loadError } = useJsApiLoader({
  //   id: "google-map",
  //   googleMapsApiKey: process.env.REACT_APP_MAPS_API,
  //   libraries,
  // });

  const [locationName, setLocationName] = React.useState("");

  const [saveLocation] = useCreateSavedLocationMutation();

  const [capacity, setCapacity] = React.useState("")

  const { classes } = useStyles();
  const { opened, close } = props;

  const validateLocation = () => {
    return locationName.length > 0 && locationName.length < 50;
  };

  useEffect(() => {
    setMarker(null);
    setLocationName("");
    setCapacity("");
  }, [opened]);

  const onSaveLocation = () => {
    if (!validateLocation() || !marker) {
      return;
    }

    const locationObject = {
      name: locationName,
      lat: marker.lat,
      lng: marker.lng,
      capacity: capacity
    };

    saveLocation({ payload: locationObject })
      .unwrap()
      .then(() => {
        close();
        notifications.show({
          title: "Location saved",
          id: "location-saved",
          color: "green",
          message: "The location was saved successfully",
          icon: <IconCheck />,
        });
      })
      .catch((error) => {
        console.error("Error saving location:", error);
      });
  };

  const [marker, setMarker] = useState(null);
  const handleMarkerChange = (event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <>
      {window.google === undefined ? (
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_MAPS_API}
          libraries={libraries}
        />
      ) : null}
      <Modal opened={opened} onClose={close} centered withCloseButton={false}>
        <TextInput
          className={classes.input}
          withAsterisk
          label="Location Name"
          value={locationName}
          onChange={(e) => {
            setLocationName(e.currentTarget.value);
          }}
          placeholder={"The name of the location"}
          required
        />
        <TextInput
          className={classes.input}
          label="Location capacity"
          value={capacity}
          onChange={(e) => {
            setCapacity(e.currentTarget.value);
          }}
          required
          placeholder="Set capacity"
        />
        <GoogleMap
          options={mapOptions}
          center={KTHCenter}
          onClick={handleMarkerChange}
          zoom={15}
          mapContainerStyle={{
            marginTop: rem(20),
            width: "100%",
            height: "400px",
          }}
        >
          {marker && (
            <Marker
              position={marker}
              draggable
              onDragEnd={handleMarkerChange}
            />
          )}
        </GoogleMap>

        <Group position="center" mt={rem(20)}>
          <Button onClick={onSaveLocation}>Save</Button>
          <Button onClick={close} color="red">
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default CreateSavedLocations;
