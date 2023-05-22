import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { LoadingOverlay, createStyles, Button, Space } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";
import { KTHCenter, mapStyles } from "../../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { directionsCurrentLocation } from "../directions/directionsSlice";
import { triggerDetailsUpdate } from "../directions/directionsSlice";
import styles from "./MapView.module.css";

const useStyles = createStyles((theme) => ({}));

const HomeMapView = (props) => {
  const { events } = props;

  const dispatch = useDispatch();

  // access currentLocation state value from the Redux store
  const currentLocation = useSelector(
    (state) => state.directions.currentLocation
  );

  const triggerState = useSelector(
    (state) => state.directions.triggerMapAction
  );
  const [localTriggerState, setLocalTriggerState] = useState(triggerState);

  const selectedEvent = useSelector((state) => state.selectedEvent);

  const setSelectedEvent = useSetSelectedEvent();

  const [markers, setMarkers] = useState([]);
  const [markerClicked, setMarkerClicked] = useState(false);

  // Directions state
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [directionsService, setDirectionsService] = useState(null);

  function openDrawer() {
    props.openDrawer();
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
    //libraries: ['places'],
  });

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            directionsCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
        },
        () => console.error("Could not fetch location, check permissions.")
      );
    };

    const handleError = (error) => {
      console.error(error);
    };

    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (permissionStatus) {
        if (permissionStatus.state === "granted") {
          // Geolocation permission has been granted
          fetchLocation();
        } else if (permissionStatus.state === "prompt") {
          // The user will be prompted for geolocation permission
          navigator.geolocation.getCurrentPosition(fetchLocation, handleError);
        } else {
          // Geolocation permission has been denied
          console.error("Geolocation permission denied");
        }
      });

    const intervalId = setInterval(fetchLocation, 5000); // Run fetchLocation every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [directions, dispatch]);

  useEffect(() => {
    if (selectedEvent !== null) {
      setSelectedEvent(selectedEvent);
      const latitude = parseFloat(selectedEvent.location.lat);
      const longitude = parseFloat(selectedEvent.location.lng);
      setEndLocation({ lat: latitude, lng: longitude });
      console.log(endLocation);
      console.log({ lat: latitude, lng: longitude });
      clearRoute();
      calculateRoute({ lat: latitude, lng: longitude });
      setShowRoute(true);
    }

    setLocalTriggerState(triggerState);

    console.log("Try to show directions");
  }, [triggerState]);

  useEffect(() => {
    if (isLoaded) {
      loadMarkers();
      console.log("Google Maps API loaded"); // add this line
    }
  }, [isLoaded, events]);

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line
      setDirectionsService(new google.maps.DirectionsService());
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  function triggerDrawerOpen() {
    console.log("ping3");
    dispatch(triggerDetailsUpdate());
  }

  const loadMarkers = () => {
    if (!events) return null;
    let markers = [];

    const filteredEvents = events.filter(
      (event) => new Date(event.endDateTime) > new Date()
    );

    filteredEvents.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      markers.push(
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => {
            setSelectedEvent(event);
            triggerDrawerOpen();
            setMarkerClicked(true);
            setEndLocation({ lat: latitude, lng: longitude });
          }}
        />
      );
    });

    setMarkers(markers);
  };

  async function showDirections() {
    console.log("Show directions");
    clearRoute();
    await calculateRoute(endLocation);
    setShowRoute(true);
  }

  async function calculateRoute(endLocation) {
    if (!directionsService) return;

    const results = await directionsService.route({
      origin: currentLocation,
      destination: endLocation,
      travelMode: google.maps.TravelMode.WALKING, // eslint-disable-line
    });
    setDirections(results); // unesasary
    setStartLocation(currentLocation); //{lat:59.3461268, lng:18.071562}
    return results.routes[0].legs[0].distance.value;
  }

  function clearRoute() {
    setDirections(null);
    setEndLocation(null);
    setShowRoute(false);
  }

  function findNearestMarker(currentLocation) {
    if (!events) return null;

    const filteredEvents = events.filter(
      (event) => new Date(event.endDateTime) > new Date()
    );

    let nearestMarker = null;
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    filteredEvents.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);
      const markerLocation = { lat: latitude, lng: longitude };
      const R = 6371; // Radius of the earth in km
      const dLat = ((markerLocation.lat - currentLocation.lat) * Math.PI) / 180;
      const dLon = ((markerLocation.lng - currentLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((currentLocation.lat * Math.PI) / 180) *
          Math.cos((markerLocation.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Distance in meters

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestMarker = event;
      }
    });

    return nearestMarker;
  }

  function handleNearestPub() {
    triggerDrawerOpen();
    clearRoute();
    const nearestMarker = findNearestMarker(currentLocation);
    if (nearestMarker) {
      const latitude = parseFloat(nearestMarker.location.lat);
      const longitude = parseFloat(nearestMarker.location.lng);
      const markerLocation = { lat: latitude, lng: longitude };

      setEndLocation(markerLocation);
      setSelectedEvent(nearestMarker);
      //calculateRoute(markerLocation)
      //setShowRoute(true)
    }
  }

  return (
    <>
      <div
        className={`${styles.mapWrapper} ${
          markerClicked ? styles.mapWrapperMarkerClicked : ""
        }`}
      >
        <Space h="5vh" />
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
            setMarkerClicked(false);
          }}
        >
          <div
            className={styles.mapButtonsWrapper}
            style={{ position: "absolute", top: "0", right: "0", zIndex: "1" }}
          >
            <Button onClick={handleNearestPub} className={`${styles.nearest}`}>
              Nearest Pub
            </Button>
            <Button color="orange" onClick={clearRoute}>
              x
            </Button>
          </div>

          {showRoute && directions && (
            <DirectionsRenderer directions={directions} />
          )}
          {markers}
        </GoogleMap>
        <Space h="5vh" />
      </div>
    </>
  );
};

export default HomeMapView;
