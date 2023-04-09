import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { createStyles, Drawer } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
];

const KTHCenter = {
  lat: 59.3493901,
  lng: 18.0715047,
};

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

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  const renderMarkers = () => {
    if (!events) return null;

    return events.map((event) => {
      console.log(event);
      const latitude = parseFloat(event.location.latitude);
      const longitude = parseFloat(event.location.longitude);

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
