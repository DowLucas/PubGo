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

  const dispatch = useDispatch()

  // access currentLocation state value from the Redux store
  const currentLocation = useSelector((state) => state.directions.currentLocation);
  const triggerState = useSelector((state) => state.directions.triggerMapAction)
  const [localTriggerState, setLocalTriggerState] = useState(triggerState);

  const setSelectedEvent = useSetSelectedEvent();

  const [markers, setMarkers] = useState([]);
  const [markerClicked, setMarkerClicked] = useState(false);

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
    const fetchLocation = () => {
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
    };
  
    // Run fetchLocation immediately on the first render
    fetchLocation();
  
    const intervalId = setInterval(fetchLocation, 10000); // Run fetchLocation every 10 seconds
  
    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
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

    const filteredEvents = events.filter((event) => new Date(event.endDateTime) > new Date());

    filteredEvents.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);

      markers.push(
        <Marker
          key={event.id}
          position={{ lat: latitude, lng: longitude }}
          clickable
          onClick={() => {setSelectedEvent(event); setMarkerClicked(true); setEndLocation({ lat: latitude, lng: longitude })}}
        />
      );
    });

    setMarkers(markers);
  };

  async function showDirections() {
    await calculateRoute(endLocation)
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
    setDirections(results) // unesasary
    return results.routes[0].legs[0].distance.value
  }

  function clearRoute() {
    setDirections(null)
    setShowRoute(false)
  }

  function findNearestMarker(currentLocation) {
    let nearestMarker = null;
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    events.forEach((event) => {
      const latitude = parseFloat(event.location.lat);
      const longitude = parseFloat(event.location.lng);
      const markerLocation = { lat: latitude, lng: longitude }
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
  };

  function handleNearestPub() {
    clearRoute()
    const nearestMarker = findNearestMarker(currentLocation)
    if (nearestMarker) {
      const latitude = parseFloat(nearestMarker.location.lat);
      const longitude = parseFloat(nearestMarker.location.lng);
      const markerLocation = { lat: latitude, lng: longitude }

      setEndLocation(markerLocation)
      setSelectedEvent(nearestMarker)
      calculateRoute(markerLocation)
      setShowRoute(true)
    }
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
          
          <div style={{ position: "absolute", bottom: "0", left: "0", zIndex: "1" }}>
            <Button onClick={handleNearestPub}>Nearest Pub</Button>
            <Button color="orange" onClick={clearRoute}>x</Button>
          </div>
          
          {showRoute && directions && <DirectionsRenderer directions={directions}/>}
          {markers}
        </GoogleMap>
        <Space h="5vh"/>
      </div>
    </>
  );
};

export default HomeMapView;
