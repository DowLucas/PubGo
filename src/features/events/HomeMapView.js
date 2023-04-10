import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { LoadingOverlay, createStyles } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";
import { KTHCenter, mapStyles } from "../../utils/const";

const useStyles = createStyles((theme) => ({
  mapWrapper: {
    width: "100vw",
    height: "60vh",
  },
}));

const HomeMapView = (props) => {
  const { classes } = useStyles();
  const { events } = props;

  const setSelectedEvent = useSetSelectedEvent();

  const [currentLocation, setCurrentLocation] = useState(null);

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
          console.log(position.coords);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => alert("Error fetching location")
      );
    } else {
      alert("Geolocation not supported");
    }
  }, []);

  if (!isLoaded) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  const renderMarkers = () => {
    if (!events) return null;

    return events.map((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      return (
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => setSelectedEvent(event)}
        />
      );
    });
  };

  return (
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
        {renderMarkers()}
      </GoogleMap>
    </div>
  );
};

export default HomeMapView;
