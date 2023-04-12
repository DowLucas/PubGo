import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { LoadingOverlay, createStyles } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";
import { KTHCenter, mapStyles } from "../../utils/const";
import { useDispatch } from "react-redux";
import { directionsCurrentLocation } from "../directions/directionsSlice";

const useStyles = createStyles((theme) => ({
  mapWrapper: {
    width: "100vw",
    height: "60vh",
  },
}));

const HomeMapView = (props) => {
  const { classes } = useStyles();
  const { events } = props;

  const dispatch = useDispatch()

  const setSelectedEvent = useSetSelectedEvent();
  // const setCurrentLocation = useSetCurrentLocation();

  //const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  function openDrawer() {
    props.openDrawer();
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(directionsCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        () => console.error("Could not fetch location, check permissions.")
      );
    } else {
      alert("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      loadMarkers();
    }
  }, [isLoaded, events]);

  if (!isLoaded) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  const loadMarkers = () => {
    if (!events) return null;
    let markers = [];

    events.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      markers.push(
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => setSelectedEvent(event)}
        />
      );
    });

    setMarkers(markers);
  };

  return (
    <>
      <div className={classes.mapWrapper}>
        <GoogleMap
          options={{
            styles: mapStyles,
            fullscreenControl: false,
            streetViewControl: false,
          }}
          center={KTHCenter}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          {markers}
        </GoogleMap>
      </div>
    </>
  );
};

export default HomeMapView;
