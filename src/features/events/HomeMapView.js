import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { LoadingOverlay, createStyles, Space } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";
import { KTHCenter, mapStyles } from "../../utils/const";

const useStyles = createStyles((theme) => ({
  mapWrapper: {
    width: "100vw",
    height: "90vh",
    transition: "height 0.5s ease",
  },
  mapWrapperMarkerClicked: {
    height: "100vh",
  },
}));

const HomeMapView = (props) => {
  const { classes } = useStyles();
  const { events } = props;

  const setSelectedEvent = useSetSelectedEvent();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerClicked, setMarkerClicked] = useState(false);

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
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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

    const filteredEvents = events.filter((event) => new Date(event.endDateTime) > new Date());

    filteredEvents.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      markers.push(
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => {
            setSelectedEvent(event)
            setMarkerClicked(true);
          }}

        />
      );
    });

    setMarkers(markers);
  };

  const handleMapClick = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <div className={`${classes.mapWrapper} ${
          markerClicked ? classes.mapWrapperMarkerClicked : ""
        }`}>
        <Space h="5vh"/>
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
          onClick={() => {
            handleMapClick()
            setMarkerClicked(false)
            }}
        >
          {markers}
        </GoogleMap>
        <Space h="5vh"/>
      </div>
    </>
  );
};

export default HomeMapView;
