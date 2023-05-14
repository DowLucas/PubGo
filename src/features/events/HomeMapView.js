import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { LoadingOverlay, createStyles } from "@mantine/core";
import { useSetSelectedEvent } from "./actions/useSelectedEvent";
import { KTHCenter, mapStyles } from "../../utils/const";
import { useDispatch, useSelector } from "react-redux";
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

  // access currentLocation state value from the Redux store
  const currentLocation = useSelector((state) => state.directions.currentLocation);
  const triggerState = useSelector((state) => state.directions.triggerMapAction)
  const [localTriggerState, setLocalTriggerState] = useState(triggerState);

  const setSelectedEvent = useSetSelectedEvent();

  const [markers, setMarkers] = useState([]);

  // Directions state
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);


  function openDrawer() {
    props.openDrawer();
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
    //libraries: ['places'],
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
    if (triggerState != localTriggerState) {
      showDirections()
      setLocalTriggerState(triggerState)
    }
  }, [triggerState])

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
          onClick={() => {setSelectedEvent(event); setEndLocation({ lat: latitude, lng: longitude })}}
        />
      );
    });

    setMarkers(markers);
  };


  function showDirections() {
    calculateRoute(endLocation)
    setShowRoute(true)
  }

  async function calculateRoute(endLocation) {
    const directionsService = new google.maps.DirectionsService() // eslint-disable-line
    const results = await directionsService.route({
      origin: currentLocation,
      destination: endLocation,
      travelMode: google.maps.TravelMode.WALKING // eslint-disable-line
    })
    setStartLocation(currentLocation) //{lat:59.3461268, lng:18.071562}
    setDirections(results) // unessasary
    return results.routes[0].legs[0].distance.value
  }

  function clearRoute() {
    console.log("directions: "+directions)
    //DirectionsRenderer.setMap(null)
    setDirections(null)
    console.log("directions: "+directions)
  }

  async function handleNearestPub() {
    let closestMarker;
    let minimalDistance = Number.MAX_VALUE;
    const promises = [];
  
    for await (const event of events) {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);
      const distPromise = calculateRoute({ lat: latitude, lng: longitude })
        .then(dist => {
          console.log(minimalDistance);
          if (dist < minimalDistance) {
            minimalDistance = dist;
            closestMarker = event;
          }
        })
        .catch(err => console.log(err));
      promises.push(distPromise);
    }
  
    await Promise.all(promises);
    console.log("minimal distance: " + minimalDistance);
    console.log("closestMarker:");
    console.log(closestMarker);
  }

  
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
          {showRoute && directions && <DirectionsRenderer directions={directions}/>}
          {markers}
        </GoogleMap>
      </div>
      <button onClick={showDirections}>Get Directions</button>
      <button onClick={handleNearestPub}>Nearest Pub</button>
      <button onClick={clearRoute}>Clear Route</button>
    </>
  );
};

export default HomeMapView;
